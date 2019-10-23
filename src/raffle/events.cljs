(ns raffle.events
  (:require
    [raffle.routing.fx :as routing]
    [re-frame.core :as rf]
    [raffle.db :as db]))

(rf/reg-event-fx
  ::init
  (fn [_ _]
    {::routing/init #(rf/dispatch [::view-changed %])
     :db            db/initial}))

(defn- view->fx [{:keys [id params]}]
  (case id
    :item (println (str "Fetching item " (:id params) " from the server..."))
    nil))

(rf/reg-event-fx
  ::view-changed
  (fn [{:keys [db]} [_ view]]
    (merge
      {:db (assoc db :view view)}
      (view->fx view))))

(rf/reg-event-fx
  ::user-signed-in
  (fn [{:keys [db]} [_ user]]
    ;; TODO: Pass access-token to server to create a user.
    {:db (assoc db :user (dissoc user :access-token))}))
