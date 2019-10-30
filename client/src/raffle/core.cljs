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
    ["@material-ui/core/Card" :default Card]
    ["@material-ui/core/Grid" :default Grid]
    ["@material-ui/core/Link" :default Link]
    [raffle.notifications.events :as notification-events]
    [raffle.notifications.subs :as notification-subs]
    [raffle.utilities :refer [debug?]]
    [raffle.google-auth :as auth]
    [raffle.api :as api]
    [raffle.routing.core :as routing]
    [raffle.subs :as subs]
    [raffle.events :as events]
    [re-frame.core :as rf]
    [reagent.core :as r]
    [day8.re-frame.http-fx]))

(defn style [theme]
  #js {:icon        #js {:margin-right (.spacing theme 2)}
       :cardGrid    #js {:padding-top    (.spacing theme 8)
                         :padding-bottom (.spacing theme 8)}
       :card        #js {:height         "100%"
                         :display        :flex
                         :flex-direction :column}
       :grow        #js {:flex-grow 1}
       :cardMedia   #js {:padding-top "56.25%"}
       :cardContent #js {:flex-grow 1}})

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
                                   :target    "_blank"
                                   :href      location})]
        [:> Button props* children]))))

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

(def clicks (r/atom 0))

(defn- app-bar [{:keys [^js classes]}]
  (let [user (rf/subscribe [::subs/user])]
    [:> AppBar
     {:position :relative}
     [:> Toolbar
      [icon/house
       {:class (.-icon classes)}]
      [:> Typography
       {:variant   :h5
        :component :h1}
       "Cabinizer 3000"]
      [:div {:class (.-grow classes)}]
      (if @user
        [:> IconButton
         {:size     "small"
          :on-click #(rf/dispatch [::notification-events/show
                                   {:message (str "Hello " (swap! clicks inc))
                                    :variant :info}])}
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

(def variant-icons
  {:success icon/check-circle
   :warning icon/warning
   :error   icon/error
   :info    icon/info})

(defn- notification-styles [theme]
  #js {:success     #js {:background-color (aget green 600)}
       :error       #js {:background-color (.. theme -palette -error -dark)}
       :info        #js {:background-color (aget blue 600)}
       :warning     #js {:background-color (aget amber 700)}
       :iconVariant #js {:opacity      0.9
                         :margin-right (.spacing theme 1)}
       :message     #js {:display     "flex"
                         :align-items "center"}})

(defstyled notifications notification-styles [{:keys [^js classes]}]
  (let [notification (rf/subscribe [::notification-subs/notification])
        {:keys [open? variant] :or {variant :info}} @notification
        icon (get variant-icons variant)]
    [:> Snackbar
     {:anchor-origin #js {:vertical   "bottom"
                          :horizontal "left"}
      :open          open?}
     [:> SnackbarContent
      (merge {:class (aget classes (name variant))}
             (apply dissoc @notification [:open? :variant])
             {:aria-describedby :client-snackbar
              :message          (r/as-element [:span
                                               {:id    :client-snackbar
                                                :class (.-message classes)}
                                               [icon {:class (.-iconVariant classes)}]
                                               (:message @notification)])})]]))

(defstyled app style [{:keys [^js classes]}]
  [:> ThemeProvider
   {:theme (create-theme theme)}
   [:> CssBaseline]
   [app-bar {:classes classes}]
   [:main
    [:> Container
     {:max-width :md}
     [notifications]
     [card-grid {:classes classes}]]]])

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
