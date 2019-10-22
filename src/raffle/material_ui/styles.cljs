(ns raffle.material-ui.styles
  (:require
    ["@material-ui/core/styles" :refer [withStyles createMuiTheme responsiveFontSizes]]
    [reagent.core :as r]))

(def create-theme (comp responsiveFontSizes createMuiTheme))

(defn wrap [comp styles]
  (let [with-styles (withStyles styles)]
    (->> comp
         (r/reactify-component)
         (with-styles)
         (r/adapt-react-class))))
