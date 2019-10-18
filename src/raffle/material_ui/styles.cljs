(ns raffle.material-ui.styles
  (:require
    ["@material-ui/core/styles" :refer [withStyles createMuiTheme ThemeProvider]]
    [reagent.core :as r]))

(def create-theme createMuiTheme)

(defn wrap [comp styles]
  (let [with-styles (withStyles styles)]
    (->> comp
         (r/reactify-component)
         (with-styles)
         (r/adapt-react-class))))

(def theme-provider (r/adapt-react-class ThemeProvider))
