(ns raffle.notifications.events
  (:require
    [raffle.notifications.queries :as q]
    [day8.re-frame.forward-events-fx]
    [re-frame.core :as rf]))

(def ^:private interceptors [rf/trim-v])

(def ^:private db-key :notifications)

(rf/reg-event-fx
  ::start
  [interceptors]
  (fn [{:keys [db]} [opts]]
    {:db             (q/assoc-notifications db opts)
     :forward-events {:register    db-key
                      :events      #{::show}
                      :dispatch-to [::process-queue]}}))

(rf/reg-event-fx
  ::stop
  [interceptors]
  (fn [{:keys [db]}]
    {:db             (q/dissoc-notifications db)
     :forward-events {:unregister db-key}}))

(rf/reg-event-db
  ::show
  [interceptors]
  (fn [db [notification]]
    (q/queue-notification db notification)))

(rf/reg-event-fx
  ::process-queue
  [interceptors]
  (fn [{:keys [db]}]
    (let [queue (get-in db [db-key :queue])
          events (loop [queue queue
                        this (peek queue)
                        events [{:notification this :delay 0}]]
                   (if (empty? queue)
                     events
                     (recur (pop queue)
                            (peek (pop queue))
                            (let [{:keys [delay]} (last events)
                                  {:keys [show-duration]} this
                                  next (peek (pop queue))]
                              (conj events {:notification
                                            next
                                            :delay
                                            (+ delay
                                               (if show-duration
                                                 show-duration
                                                 (q/default-show-duration db))
                                               (if next
                                                 (q/default-hide-duration db)
                                                 0))})))))]
      {:dispatch-n     (mapv #(vec [::schedule-next-notification %]) events)
       :dispatch-later [{:dispatch [::clear-queue]
                         :ms       (-> events last :delay)}]})))
(rf/reg-event-fx
  ::schedule-next-notification
  [interceptors]
  (fn [{:keys [db]} [{:keys [delay notification]}]]
    {:dispatch-later [{:dispatch [::show-notification notification]
                       :ms       delay}]}))

(rf/reg-event-db
  ::clear-queue
  [interceptors]
  (fn [db]
    (assoc-in db [db-key :queue] #queue [])))

(rf/reg-event-db
  ::show-notification
  [interceptors]
  (fn [db [notification]]
    (q/show-notification db notification)))

(rf/reg-event-db
  ::hide-notification
  [interceptors]
  (fn [db]
    (q/assoc-open db false)))
