(ns raffle.app
  (:require-macros [raffle.macros :refer [defstyled]])
  (:require
    [raffle.material-ui.styles :refer [create-theme]]

    ["@material-ui/core/CssBaseline" :default CssBaseline]
    ["@material-ui/core/Typography" :default Typography]
    ["@material-ui/core/IconButton" :default IconButton]
    ["@material-ui/core/styles" :refer [ThemeProvider]]
    ["@material-ui/core/Container" :default Container]
    ["@material-ui/core/Toolbar" :default Toolbar]
    ["@material-ui/core/AppBar" :default AppBar]
    ["@material-ui/core/Avatar" :default Avatar]

    [raffle.pages.phone-book.core :as phone-book]
    [raffle.pages.index.core :as index]

    [raffle.components :refer [button-link]]
    [raffle.material-ui.icons :as icon]
    [raffle.google-auth :as auth]
    [raffle.events :as events]
    [raffle.subs :as subs]
    [re-frame.core :as rf]))

(defn style [theme]
  #js {:icon         #js {:margin-right (.spacing theme 2)}
       :toolbar      #js {:flex-wrap "wrap"}
       :toolbarTitle #js {:flex-grow 1}
       :link         #js {:margin (.spacing theme 1 1.5)}})

(def theme
  #js {:palette #js {:primary   #js {:main "#B12F2A"}
                     :secondary #js {:main "#0C2338"}}})

(declare app-bar)

(defstyled render style [{:keys [^js classes] :as props}]
  (let [view (rf/subscribe [::subs/view])]
    [:> ThemeProvider
     {:theme (create-theme theme)}
     [:> CssBaseline]
     [app-bar props]
     [:main
      [:> Container
       {:max-width :md}
       (case (:id @view)
         :index [index/render]
         :phone-book [phone-book/render]
         [:h1 "404 Not Found"])]]]))

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
                        (rf/dispatch [::events/user-signed-in user]))
          :on-failure #(js/console.log %)}])]]))