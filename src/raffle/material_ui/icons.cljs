(ns raffle.material-ui.icons
  (:require
    ["@material-ui/icons/House" :default House]
    [reagent.core :as r]))

(def house (r/adapt-react-class House))
