(ns raffle.events
  (:require
    [re-frame.core :as rf]
    [raffle.db :as db]))

(rf/reg-event-db
  ::init
  (fn [_ _]
    db/initial))

(defn- view->fx [{:keys [id]}]
  (cond
    ;; TODO: Add mapping from views to effects here...
    :else nil))

(rf/reg-event-fx
  ::view-changed
  (fn [{:keys [db]} [_ view]]
    (merge
      {:db (assoc db :view view)}
      (view->fx view))))
