(ns raffle.routing.core
  (:refer-clojure :exclude [resolve])
  (:require [bide.core :as bide]))

(def ^:private router
  (bide/router [["/" :phone-book]
                ["/items/:id" :item]
                ["/phone-book" :phone-book]]))

(def navigate! (partial bide/navigate! router))

(def replace! (partial bide/replace! router))

(def resolve (partial bide/resolve router))

(defn start! [on-navigate]
  (letfn [(-on-navigate [id params query]
            (let [view (merge {:id id}
                              (when params {:params params})
                              (when query {:query query}))]
              (on-navigate view)))]
    (let [options {:default     :index
                   :html5?      true
                   :on-navigate -on-navigate}]
      (bide/start! router options))))
