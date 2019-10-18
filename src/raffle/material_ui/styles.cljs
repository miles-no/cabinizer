(ns raffle.material-ui.styles
  (:require
    ["@material-ui/core/styles" :refer [withStyles createMuiTheme ThemeProvider]]
    [reagent.core :as r]))

(defn create-theme [theme]
  (-> theme clj->js createMuiTheme))

(defn- styles->js [styles]
  (withStyles (comp clj->js styles)))

(defn with-style [styles comp]
  (let [apply-styles (styles->js styles)]
    (->> comp
         (reagent.core/reactify-component)
         (apply-styles)
         (reagent.core/adapt-react-class))))

(def theme-provider (r/adapt-react-class ThemeProvider))
