(ns raffle.api
  (:require
    [ajax.core :refer [to-interceptor default-interceptors]]
    [raffle.utilities :refer [debug?]]
    [cemerick.url :refer [url]]
    [raffle.subs :as subs]
    [re-frame.core :as rf]))

(def user (rf/subscribe [::subs/user]))

(defn service-url
  ([path] (service-url path nil))
  ([path query]
   (->
     (if debug?
       (url "https://localhost:5001")
       (url "https://cabinizer.azurewebsites.net"))
     (assoc :query query)
     (assoc :path path)
     (str))))

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
