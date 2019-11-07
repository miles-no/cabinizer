(ns raffle.pages.phone-book.subs
  (:require [re-frame.core :as rf]))

(rf/reg-sub
  ::phone-book
  (fn [db _]
    (get db :phone-book)))