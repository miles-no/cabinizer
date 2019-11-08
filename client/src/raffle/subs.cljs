(ns raffle.subs
  (:require
    [raffle.utilities :as utils]
    [re-frame.core :as rf]))

(rf/reg-sub
  ::view
  (fn [db _]
    (get db :view)))

(rf/reg-sub
  ::user
  (fn [db _]
    (get db :user)))

(rf/reg-sub
  ::loading?
  (fn [db [_ key]]
    (utils/loading? db key)))
