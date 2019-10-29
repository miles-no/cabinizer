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
                (js/console.log @user)
                (if-let [token (get @user :id-token)]
                  (assoc-in request [:headers :Authorization] (str "Bearer " token))
                  request))}))

(def redirect-to-login
  (to-interceptor
    {:name     "Redirect to login"
     :response (fn [response]
                 (rf/dispatch [::navigate {:name :login}])
                 response)}))

(defn enable-interceptors! []
  (swap! default-interceptors
    (partial concat [pass-bearer-token redirect-to-login])))
