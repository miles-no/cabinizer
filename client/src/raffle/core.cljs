(ns raffle.core
  (:require-macros [raffle.macros :refer [defstyled]])
  (:require
    [raffle.material-ui.styles :refer [create-theme]]
    [raffle.material-ui.icons :as icon]
    ["@material-ui/core/colors" :refer [amber blue green]]
    ["@material-ui/core/styles" :refer [ThemeProvider]]
    ["@material-ui/core/Typography" :default Typography]
    ["@material-ui/core/CardContent" :default CardContent]
    ["@material-ui/core/CardMedia" :default CardMedia]
    ["@material-ui/core/CardActions" :default CardActions]
    ["@material-ui/core/Container" :default Container]
    ["@material-ui/core/CssBaseline" :default CssBaseline]
    ["@material-ui/core/IconButton" :default IconButton]
    ["@material-ui/core/Toolbar" :default Toolbar]
    ["@material-ui/core/AppBar" :default AppBar]
    ["@material-ui/core/SnackbarContent" :default SnackbarContent]
    ["@material-ui/core/Snackbar" :default Snackbar]
    ["@material-ui/core/Avatar" :default Avatar]
    ["@material-ui/core/Button" :default Button]
    ["@material-ui/core/Table" :default Table]
    ["@material-ui/core/TableBody" :default TableBody]
    ["@material-ui/core/TableCell" :default TableCell]
    ["@material-ui/core/TableHead" :default TableHead]
    ["@material-ui/core/TableRow" :default TableRow]
    ["@material-ui/core/Card" :default Card]
    ["@material-ui/core/Paper" :default Paper]
    ["@material-ui/core/FormControl" :default FormControl]
    ["@material-ui/core/InputLabel" :default InputLabel]
    ["@material-ui/core/Select" :default Select]
    ["@material-ui/core/MenuItem" :default MenuItem]
    ["@material-ui/core/Grid" :default Grid]
    ["@material-ui/core/Link" :default Link]
    [raffle.utilities :refer [debug?]]
    [raffle.google-auth :as auth]
    [raffle.api :as api]
    [raffle.routing.core :as routing]
    [raffle.subs :as subs]
    [raffle.events :as events]
    [re-frame.core :as rf]
    [reagent.core :as r]
    [day8.re-frame.http-fx]
    [clojure.string :as str]))

(defn style [theme]
  #js {:icon         #js {:margin-right (.spacing theme 2)}
       :toolbar      #js {:flex-wrap "wrap"}
       :toolbarTitle #js {:flex-grow 1}
       :link         #js {:margin (.spacing theme 1 1.5)}
       :cardGrid     #js {:padding-top    (.spacing theme 8)
                          :padding-bottom (.spacing theme 8)}
       :card         #js {:height         "100%"
                          :display        :flex
                          :flex-direction :column}
       :cardMedia    #js {:padding-top "56.25%"}
       :cardContent  #js {:flex-grow 1}})

(def theme
  #js {:palette #js {:primary   #js {:main "#B12F2A"}
                     :secondary #js {:main "#0C2338"}}})

(defn link-button [{:keys [to params query replace? target] :as props} children]
  (let [navigate! (if replace? routing/replace! routing/navigate!)
        self-target? (or (nil? target) (= target "_self"))
        location (routing/resolve to params query)]
    (letfn [(-on-click [event]
              (let [left-button? (= (.-button event) 0)
                    modified? (or (.-metaKey event) (.-altKey event) (.-ctrlKey event) (.-shiftKey event))]
                (when (and left-button? self-target? (not modified?))
                  (.preventDefault event)
                  (navigate! to params query))))]
      (let [props* (r/merge-props props
                                  {:on-click  -on-click
                                   :component Link
                                   :href      location})]
        [:> Button props* children]))))

(defn button-link [{:keys [to params query replace? target] :as props} children]
  (let [navigate! (if replace? routing/replace! routing/navigate!)
        self-target? (or (nil? target) (= target "_self"))
        location (routing/resolve to params query)]
    (letfn [(-on-click [event]
              (let [left-button? (= (.-button event) 0)
                    modified? (or (.-metaKey event) (.-altKey event) (.-ctrlKey event) (.-shiftKey event))]
                (when (and left-button? self-target? (not modified?))
                  (.preventDefault event)
                  (navigate! to params query))))]
      (let [props* (r/merge-props props
                                  {:on-click -on-click
                                   :variant  :button
                                   :href     location})]
        [:> Link props* children]))))

(defn- raffle-item [{:keys [item ^js classes]}]
  [:> Grid
   {:item true
    :xs   12
    :sm   6
    :md   4}
   [:> Card
    {:class (.-card classes)}
    [:> CardMedia
     {:class (.-cardMedia classes)
      :image (:image-url item)
      :title "Image title"}]
    [:> CardContent
     {:class (.-cardContent classes)}
     [:> Typography
      {:gutter-bottom true
       :variant       :h5
       :component     :h2}
      (str "Item " (:id item))]
     [:> Typography
      (:description item)]]
    [:> CardActions
     [link-button
      {:size   :small
       :color  :primary
       :to     :item
       :params {:id (:id item)}}
      "View"]]]])

(defn- card-grid [{:keys [^js classes]}]
  (let [items (rf/subscribe [::subs/items])]
    (fn []
      [:> Grid
       {:class     (.-cardGrid classes)
        :container true
        :spacing   4}
       (for [{:keys [id] :as item} @items]
         [raffle-item
          {:key     id
           :item    item
           :classes classes}])])))

(defn- phone-book-row [{:keys [entry ^js classes]}]
  [:> TableRow
   [:> TableCell
    [:> Avatar
     {:src (:pictureUrl entry)
      :alt (:fullName entry)}]]
   [:> TableCell
    {:component :th
     :scope     :row}
    (str (:familyName entry) ", " (:givenName entry))]
   [:> TableCell
    [:a
     {:href (str "mailto:" (:email entry))}
     (:email entry)]]
   [:> TableCell
    [:a
     {:href (str "tel:" (:phoneNumber entry))}
     (:phoneNumber entry)]]
   [:> TableCell (:organizationUnitPath entry)]])

(defn- phone-book-style [theme]
  #js {:paper        #js {:margin-top (.spacing theme 2)}
       :tableWrapper #js {:max-height 600
                          :overflow   "auto"}
       :officeSelect #js {:min-width 200
                          :margin    (.spacing theme 2)}})

(defstyled phone-book phone-book-style [{:keys [^js classes]}]
  (let [phone-book (rf/subscribe [::subs/phone-book])
        office (r/atom nil)]
    (fn [{:keys [^js classes]}]
      [:> Paper
       {:class (.-paper classes)}
       [:> Toolbar
        [:> FormControl
         {:class (.-officeSelect classes)}
         [:> InputLabel
          {:id :office-select-label}
          "Office"]
         [:> Select
          {:labelId       :office-select-label
           :on-change     (fn [event]
                            (let [value (.. event -target -value)]
                              (reset! office value)))
           :default-value @office}
          [:> MenuItem {:value "/"} "All"]
          [:> MenuItem {:value "/_Bergen"} "Bergen"]
          [:> MenuItem {:value "/_Oslo"} "Oslo"]
          [:> MenuItem {:value "/_Stavanger"} "Stavanger"]
          [:> MenuItem {:value "/_Trondheim"} "Trondheim"]
          [:> MenuItem {:value "/_Johannesburg"} "Johannesburg"]]]]
       [:div
        {:class (.-tableWrapper classes)}
        [:> Table
         {:stickyHeader true}
         [:> TableHead
          [:> TableRow
           [:> TableCell "Picture"]
           [:> TableCell "Name"]
           [:> TableCell "Email"]
           [:> TableCell "Phone No."]
           [:> TableCell "Department"]]]
         [:> TableBody
          (let [office (or @office "/")
                entries (filter
                          (fn [entry]
                            (str/starts-with? (:organizationUnitPath entry) office))
                          @phone-book)]
            (js/console.log office)
            (for [{:keys [id] :as entry} entries]
              [phone-book-row
               {:key     id
                :entry   entry
                :classes classes}]))]]]])))

(defn- app-bar [{:keys [^js classes]}]
  (let [user (rf/subscribe [::subs/user])]
    [:> AppBar
     {:position :static
      :color    :primary}
     [:> Toolbar
      {:class (.-toolbar classes)}
      [icon/house
       {:class (.-icon classes)}]
      [:> Typography
       {:variant   :h5
        :component :h1
        :class     (.-toolbarTitle classes)}
       "Cabinizer 3000"]
      [:nav
       [button-link
        {:color :inherit
         :to    :phone-book
         :class (.-link classes)}
        "Phone Book"]]
      (if @user
        [:> IconButton
         {:size "small"}
         [:> Avatar
          {:src (:pictureUrl @user)
           :alt (:name @user)}]]
        [auth/signin-button
         {:client-id  "611538057711-dia11nhabvku7cgd0edubeupju1jf4rg.apps.googleusercontent.com"
          :on-success (fn [^js/gapi.auth2.GoogleUser user]
                        (let [profile (.getBasicProfile user)
                              auth-response (.getAuthResponse user true)
                              user {:idToken     (.-id_token auth-response)
                                    :accessToken (.-access_token auth-response)
                                    :familyName  (.getFamilyName profile)
                                    :givenName   (.getGivenName profile)
                                    :pictureUrl  (.getImageUrl profile)
                                    :email       (.getEmail profile)
                                    :id          (.getId profile)}]
                          (rf/dispatch [::events/user-signed-in user])))
          :on-failure #(js/console.log %)}])]]))

(defstyled app style [{:keys [^js classes]}]
  (let [view (rf/subscribe [::subs/view])]
    [:> ThemeProvider
     {:theme (create-theme theme)}
     [:> CssBaseline]
     [app-bar {:classes classes}]
     [:main
      [:> Container
       {:max-width :md}
       (case (:id @view)
         :index [card-grid {:classes classes}]
         :phone-book [phone-book]
         :else [:h1 "404 Not Found"])]]]))

(defn- dev-setup []
  (when debug?
    (enable-console-print!)
    (println "Running in dev mode...")))

(defn- mount-app []
  (r/render [app] (.getElementById js/document "app")))

(defn ^:dev/after-load reload! []
  (rf/clear-subscription-cache!)
  (mount-app))

(defn ^:export init! []
  (api/enable-interceptors!)
  (rf/dispatch-sync [::events/init])
  (dev-setup)
  (mount-app))
