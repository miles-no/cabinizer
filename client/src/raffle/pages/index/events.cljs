(ns raffle.pages.index.events
  (:require
    [re-frame.core :as rf]
    [ajax.core :as ajax]
    [raffle.api :as api]))

(def ^:private interceptors [rf/trim-v])

(rf/reg-event-fx
  ::fetch-items
  [interceptors]
  (fn []
    {:http-xhrio {:method          :get
                  :uri             (api/service-url "/items")
                  :response-format (ajax/json-response-format {:keywords? true})
                  :on-success      [::items-received]}}))

(rf/reg-event-fx
  ::items-received
  [interceptors]
  (fn [{:keys [db]} [items]]
    {:db (assoc db :items items)}))