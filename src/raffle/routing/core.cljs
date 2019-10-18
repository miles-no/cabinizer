(ns raffle.routing.core
  (:require
    [bide.core :as bide]))

(def ^:private router
  (bide/router [["/" :index]
                ["/items/:id" :item]]))

(defn navigate!
  ([id] (navigate! id nil nil))
  ([id params] (navigate! id params nil))
  ([id params query] (bide/navigate! router id params query)))

(defn replace!
  ([id] (replace! id nil nil))
  ([id params] (replace! id params nil))
  ([id params query] (bide/replace! router id params query)))

(defn init! [on-navigate]
  (bide/start! router {:default     :index
                       :html5?      true
                       :on-navigate (fn [id params query]
                                      (on-navigate
                                        (merge {:id id}
                                               (when params {:params params})
                                               (when query {:query query}))))}))
