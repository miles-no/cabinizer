(ns raffle.events
  (:require
    [day8.re-frame.tracing :refer-macros [fn-traced]]
    [raffle.notifications.events :as notifications]
    [raffle.routing.fx :as routing]
    [re-frame.core :as rf]
    [ajax.core :as ajax]
    [raffle.db :as db]))

(def ^:private interceptors [rf/trim-v])

(rf/reg-event-fx
  ::init
  [interceptors]
  (fn-traced []
    {::routing/start #(rf/dispatch [::view-changed %])
     :dispatch       [::notifications/start {:default-show-duration 2000
                                             :default-hide-duration 1000}]
     :db             db/initial}))

(defn- view->fx [{:keys [id params]}]
  (case id
    :item (println (str "Fetching item " (:id params) " from the server..."))
    nil))

(rf/reg-event-fx
  ::view-changed
  [interceptors]
  (fn-traced [{:keys [db]} [view]]
    (merge
      {:db (assoc db :view view)}
      (view->fx view))))

(rf/reg-event-fx
  ::user-signed-in
  [interceptors]
  (fn-traced [{:keys [db]} [user]]
    ;; TODO: Pass access-token to server to create a user.
    {:db         (assoc db :user (dissoc user :access-token))
     :http-xhrio {:method          :get
                  :uri             "https://localhost:5001/items"
                  :response-format (ajax/json-response-format {:keywords? true})
                  :on-success      [::user-loaded]
                  :on-failure      [::load-user-failed]}}))
