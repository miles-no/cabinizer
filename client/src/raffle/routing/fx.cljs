(ns raffle.routing.fx
  (:require
    [raffle.routing.core :as routing]
    [re-frame.core :as rf]))

(rf/reg-fx
  ::navigate
  (fn [[id params query]]
    (routing/navigate! id params query)))

(rf/reg-fx
  ::replace
  (fn [[id params query]]
    (routing/replace! id params query)))

(rf/reg-fx
  ::start
  (fn [on-navigate]
    (routing/start! on-navigate)))
