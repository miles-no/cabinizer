(ns raffle.utilities)

(def debug? ^boolean goog.DEBUG)

(defn dissoc-in [m [k & ks]]
  (if ks
    (if-let [next (get m k)]
      (let [new (dissoc-in next ks)]
        (if (seq new)
          (assoc m k new)
          (dissoc m k)))
      m)
    (dissoc m k)))

(defn set-loading [db key loading?]
  (if loading?
    (assoc-in db [:loading? key] true)
    (dissoc-in db [:loading? key])))

(defn loading? [db key]
  (get-in db [:loading? key] false))
