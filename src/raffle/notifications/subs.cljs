(ns raffle.notifications.subs
  (:require
    [raffle.notifications.queries :as q]
    [re-frame.core :as rf]))

(rf/reg-sub
  ::notification
  (fn [db]
    (q/notification db)))
