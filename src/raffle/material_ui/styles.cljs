(ns raffle.material-ui.styles
  (:require
    ["@material-ui/core/styles" :refer [withStyles createMuiTheme ThemeProvider]]
    [reagent.core :as r]))

(defn create-theme [theme]
  (-> theme clj->js createMuiTheme))

(defn wrap [styles]
  (withStyles (comp clj->js styles)))

(def theme-provider (r/adapt-react-class ThemeProvider))
