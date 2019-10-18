(ns raffle.material-ui.core
  (:require
    ["@material-ui/core/CssBaseline" :default CssBaseline]
    ["@material-ui/core/CardContent" :default CardContent]
    ["@material-ui/core/CardActions" :default CardActions]
    ["@material-ui/core/Typography" :default Typography]
    ["@material-ui/core/Container" :default Container]
    ["@material-ui/core/CardMedia" :default CardMedia]
    ["@material-ui/core/Toolbar" :default Toolbar]
    ["@material-ui/core/AppBar" :default AppBar]
    ["@material-ui/core/Button" :default Button]
    ["@material-ui/core/Grid" :default Grid]
    ["@material-ui/core/Card" :default Card]
    [reagent.core :as r]))

(def css-baseline (r/adapt-react-class CssBaseline))
(def card-content (r/adapt-react-class CardContent))
(def card-actions (r/adapt-react-class CardActions))
(def typography (r/adapt-react-class Typography))
(def container (r/adapt-react-class Container))
(def card-media (r/adapt-react-class CardMedia))
(def toolbar (r/adapt-react-class Toolbar))
(def app-bar (r/adapt-react-class AppBar))
(def button (r/adapt-react-class Button))
(def grid (r/adapt-react-class Grid))
(def card (r/adapt-react-class Card))
