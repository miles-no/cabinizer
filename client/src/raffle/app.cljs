(ns raffle.app
  (:require-macros [raffle.macros :refer [defstyled]])
  (:require
    [raffle.material-ui.styles :refer [create-theme]]

    ["@material-ui/core/CircularProgress" :default CircularProgress]
    ["@material-ui/core/CssBaseline" :default CssBaseline]
    ["@material-ui/core/Typography" :default Typography]
    ["@material-ui/core/IconButton" :default IconButton]
    ["@material-ui/core/styles" :refer [ThemeProvider]]
    ["@material-ui/core/Container" :default Container]
    ["@material-ui/core/Toolbar" :default Toolbar]
    ["@material-ui/core/AppBar" :default AppBar]
    ["@material-ui/core/Button" :default Button]
    ["@material-ui/core/Avatar" :default Avatar]
    ["@material-ui/core/Paper" :default Paper]

    [raffle.pages.phone-book.core :as phone-book]
    [raffle.pages.index.core :as index]

    [raffle.components :refer [button-link]]
    [raffle.material-ui.icons :as icon]
    [raffle.google-auth :as auth]
    [raffle.events :as events]
    [raffle.subs :as subs]
    [re-frame.core :as rf]
    [reagent.core :as r]))

(defn style [theme]
  #js {:icon         #js {:margin-right (.spacing theme 2)}
       :toolbar      #js {:flex-wrap "wrap"}
       :toolbarTitle #js {:flex-grow 1}
       :link         #js {:margin (.spacing theme 1 1.5)}
       :container    #js {:margin-top (.spacing theme 3)}
       :cabin        #js {:max-height 230
                          :margin-bottom (.spacing theme 2)}
       :signInButton #js {:width 200}
       :welcomeText  #js {:margin-bottom (.spacing theme 2)}
       :paper        #js {:display "flex"
                          :height 400
                          :flex-wrap "wrap"
                          :flex-direction "column"
                          :align-items "center"
                          :justify-content "center"}})

(def theme
  #js {:palette #js {:primary   #js {:main "#B12F2A"}
                     :secondary #js {:main "#0C2338"}}})

(declare app-bar)

(defstyled render style [{:keys [^js classes] :as props}]
  (let [loading? (rf/subscribe [::subs/loading? :auth])
        view (rf/subscribe [::subs/view])
        user (rf/subscribe [::subs/user])]
    (fn [{:keys [^js classes] :as props}]
      [:> ThemeProvider
       {:theme (create-theme theme)}
       [:> CssBaseline]
       [app-bar (r/merge-props props {:user user})]
       [:main
        [:> Container
         {:class     (.-container classes)
          :max-width (if @user :md :sm)}
         (if @user
           (case (:id @view)
             :index [index/render]
             :phone-book [phone-book/render]
             [:h1 "404 Not Found"])
           [:> Paper
            {:class (.-paper classes)}
            [:img
             {:class (.-cabin classes)
              :src   "/img/cabin.svg"}]
            [:> Typography
             {:class (.-welcomeText classes)}
             "Welcome to Cabinizer 3000!"]
            (if @loading?
              [:> CircularProgress]
              [:> Button
               {:on-click #(auth/sign-in!)
                :class (.-signInButton classes)
                :variant :contained
                :color :primary
                :size :large}
               "Sign In"])])]]])))

(defn- app-bar [{:keys [user ^js classes]}]
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
    (when @user
      [:<>
       [:nav
        [button-link
         {:color :inherit
          :to    :phone-book
          :class (.-link classes)}
         "Phone Book"]]
       [:> IconButton
        {:size     "small"
         :on-click #(auth/sign-out!)}
        [:> Avatar
         {:src (:pictureUrl @user)
          :alt (:name @user)}]]])]])