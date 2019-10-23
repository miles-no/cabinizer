(ns raffle.notifications.queries)

(def db-key :notifications)

(defn assoc-notifications [db opts]
  (assoc db db-key (merge opts {:queue #queue []})))

(defn dissoc-notifications [db]
  (dissoc db db-key))

(defn queue-notification [db notification]
  (update-in db [db-key :queue] conj notification))

(defn queue [db]
  (-> db
      (get-in [db-key :queue])))

(defn show-notification [db notification]
  (assoc-in db [db-key :notification]
            (cond
              (string? notification)
              {:message notification :open? true}

              (map? notification)
              (merge notification {:open? true})

              :else notification)))

(defn default-show-duration [db]
  (get-in db [db-key :default-show-duration]))

(defn default-hide-duration [db]
  (get-in db [db-key :default-hide-duration]))

(defn assoc-open [db value]
  (assoc-in db [db-key :notification :open?] value))

(defn notification [db]
  (get-in db [db-key :notification]))

(defn clear-queue [db]
  (assoc-in db [db-key :queue] #queue []))