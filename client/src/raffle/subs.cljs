(ns raffle.subs
  (:require [re-frame.core :as rf]))

(rf/reg-sub
  ::view
  (fn [db _]
    (get db :view)))

(rf/reg-sub
  ::user
  (fn [db _]
    (get db :user)))
