(ns raffle.core
  (:require-macros [raffle.macros :refer [defstyled]])
  (:require
    [raffle.material-ui.styles :refer [create-theme]]
    [raffle.material-ui.icons :as icon]
    ["@material-ui/core/styles" :refer [ThemeProvider]]
    ["@material-ui/core/Typography" :default Typography]
    ["@material-ui/core/CardContent" :default CardContent]
    ["@material-ui/core/CardMedia" :default CardMedia]
    ["@material-ui/core/CardActions" :default CardActions]
    ["@material-ui/core/Container" :default Container]
    ["@material-ui/core/CssBaseline" :default CssBaseline]
    ["@material-ui/core/Toolbar" :default Toolbar]
    ["@material-ui/core/AppBar" :default AppBar]
    ["@material-ui/core/Button" :default Button]
    ["@material-ui/core/Card" :default Card]
    ["@material-ui/core/Grid" :default Grid]
    ["@material-ui/core/Link" :default Link]
    [raffle.routing.core :as routing]
    [raffle.subs :as subs]
    [raffle.events :as events]
    [re-frame.core :as rf]
    [reagent.core :as r]))

(defn style [theme]
  #js {:icon        #js {:margin-right (.spacing theme 2)}
       :cardGrid    #js {:padding-top    (.spacing theme 8)
                         :padding-bottom (.spacing theme 8)}
       :card        #js {:height         "100%"
                         :display        :flex
                         :flex-direction :column}
       :cardMedia   #js {:padding-top "56.25%"}
       :cardContent #js {:flex-grow 1}})

(def theme
  #js {:palette #js {:primary   #js {:main "#B12F2A"}
                     :secondary #js {:main "#0C2338"}}})

(defn link-button [{:keys [to params query replace? target] :as props} children]
  (let [navigate!    (if replace? routing/replace! routing/navigate!)
        self-target? (or (nil? target) (= target "_self"))
        location     (routing/resolve to params query)]
    (letfn [(-on-click [event]
              (let [left-button? (= (.-button event) 0)
                    modified?    (or (.-metaKey event) (.-altKey event) (.-ctrlKey event) (.-shiftKey event))]
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

(defstyled app style [{:keys [^js classes]}]
  [:> ThemeProvider
   {:theme (create-theme theme)}
   [:> CssBaseline]
   [:> AppBar
    {:position :relative}
    [:> Toolbar
     [icon/house
      {:class (.-icon classes)}]
     [:> Typography
      {:variant   :h5
       :component :h1}
      "Cabinizer 3000"]]]
   [:main
    [:> Container
     {:max-width :md}
     [card-grid {:classes classes}]]]])

(defn- dev-setup []
  (when ^boolean goog.DEBUG
    (enable-console-print!)
    (println "Running in dev mode...")))

(defn- mount-app []
  (r/render [app] (.getElementById js/document "app")))

(defn ^:dev/after-load reload! []
  (rf/clear-subscription-cache!)
  (mount-app))

(defn ^:export init! []
  (rf/dispatch [::events/init])
  (dev-setup)
  (mount-app))
