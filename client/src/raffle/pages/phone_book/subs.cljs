(ns raffle.pages.phone-book.subs
  (:require [re-frame.core :as rf]))

(rf/reg-sub
  ::users
  (fn [db _]
    (get db :users)))