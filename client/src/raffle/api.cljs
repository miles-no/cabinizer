(ns raffle.api
  (:require
    [ajax.core :refer [to-interceptor default-interceptors]]
    [raffle.subs :as subs]
    [re-frame.core :as rf]))

(def user (rf/subscribe [::subs/user]))

(def pass-bearer-token
  (to-interceptor
    {:name    "Pass Bearer token"
     :request (fn [request]
                (if-let [token (get @user :idToken)]
                  (assoc-in request [:headers :Authorization] (str "Bearer " token))
                  request))}))

(defn enable-interceptors! []
  (swap! default-interceptors
    (partial concat [pass-bearer-token])))
