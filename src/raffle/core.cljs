(ns raffle.core
  (:require-macros [raffle.macros :refer [defstyled]])
  (:require
    [raffle.material-ui.styles :refer [create-theme theme-provider]]
    [raffle.material-ui.icons :as icon]
    [raffle.material-ui.core :as mui]
    [re-frame.core :as rf]
    [reagent.core :as r]))

(declare card-item)
(def cards [1 2 3 4 5])

(defn style [theme]
  {:icon        {:margin-right (.spacing theme 2)}
   :cardGrid    {:padding-top    (.spacing theme 8)
                 :padding-bottom (.spacing theme 8)}
   :card        {:height         "100%"
                 :display        :flex
                 :flex-direction :column}
   :cardMedia   {:padding-top "56.25%"}
   :cardContent {:flex-grow 1}})

(def theme
  (create-theme
    {:palette
     {:primary   {:main "#B12F2A"}
      :secondary {:main "#0C2338"}}}))

(defstyled app style [{:keys [^js classes]}]
  [theme-provider
   {:theme theme}
   [mui/css-baseline]
   [mui/app-bar
    {:position :relative}
    [mui/toolbar
     [icon/house
      {:class (.-icon classes)}]]]
   [:main
    [mui/container
     {:max-width :md}
     [mui/grid
      {:class     (.-cardGrid classes)
       :container true
       :spacing   4}
      (for [item cards]
        ^{:key item}
        [card-item {:item item :classes classes}])]]]])

(defn- card-item [{:keys [item ^js classes]}]
  [mui/grid
   {:item true
    :xs   12
    :sm   6
    :md   4}
   [mui/card
    {:class (.-card classes)}
    [mui/card-media
     {:class (.-cardMedia classes)
      :image "https://source.unsplash.com/random"
      :title "Image title"}]
    [mui/card-content
     {:class (.-cardContent classes)}
     [mui/typography
      {:gutter-bottom true
       :variant       :h5
       :component     :h2}
      (str "Item " item)]
     [mui/typography
      "This is a media card. You can use this section to describe the content."]]
    [mui/card-actions
     [mui/button
      {:size  :small
       :color :primary}
      "View"]]]])

(defn mount-app []
  (r/render [app] (.getElementById js/document "app")))

(defn ^:dev/after-load reload! []
  (rf/clear-subscription-cache!)
  (mount-app))

(defn ^:export init! []
  (mount-app))
