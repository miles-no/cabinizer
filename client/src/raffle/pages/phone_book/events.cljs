(ns raffle.pages.phone-book.events
  (:require
    [re-frame.core :as rf]
    [ajax.core :as ajax]
    [raffle.api :as api]))

(def ^:private interceptors [rf/trim-v])

(rf/reg-event-fx
  ::fetch-users
  [interceptors]
  (fn [_ [{:keys [page size orgUnitPath] :or {page 1, size 25, orgUnitPath "/"}}]]
    {:http-xhrio {:method          :get
                  :uri             (api/service-url "/users"
                                                    {:orgUnitPath orgUnitPath
                                                     :page        page
                                                     :size        size})
                  :response-format (ajax/json-response-format {:keywords? true})
                  :on-success      [::users-received]}}))

(rf/reg-event-fx
  ::users-received
  [interceptors]
  (fn [{:keys [db]} [users]]
    {:db (assoc db :users users)}))