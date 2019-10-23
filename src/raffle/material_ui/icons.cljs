(ns raffle.material-ui.icons
  (:require
    ["@material-ui/icons/CheckCircle" :default CheckCircle]
    ["@material-ui/icons/Warning" :default Warning]
    ["@material-ui/icons/Error" :default Error]
    ["@material-ui/icons/House" :default House]
    ["@material-ui/icons/Info" :default Info]
    [reagent.core :as r]))

(def check-circle (r/adapt-react-class CheckCircle))
(def warning (r/adapt-react-class Warning))
(def error (r/adapt-react-class Error))
(def house (r/adapt-react-class House))
(def info (r/adapt-react-class Info))
