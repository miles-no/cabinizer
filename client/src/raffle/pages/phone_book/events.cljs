(ns raffle.pages.phone-book.events
  (:require
    [day8.re-frame.tracing :refer-macros [fn-traced]]
    [re-frame.core :as rf]
    [ajax.core :as ajax]
    [raffle.api :as api]))

(def ^:private interceptors [rf/trim-v])

(rf/reg-event-fx
  ::fetch-phone-book
  [interceptors]
  (fn-traced [_ [{:keys [page size orgUnitPath] :or {page 1, size 25, orgUnitPath "/"}}]]
             {:http-xhrio {:method          :get
                           :uri             (str api/service-url "/users?page=" page "&size=" size "&orgUnitPath=" orgUnitPath)
                           :response-format (ajax/json-response-format {:keywords? true})
                           :on-success      [::phone-book-received]}}))

(rf/reg-event-fx
  ::phone-book-received
  [interceptors]
  (fn-traced [{:keys [db]} [phone-book]]
             {:db (assoc db :phone-book phone-book)}))