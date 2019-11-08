(ns raffle.core
  (:require
    [raffle.utilities :refer [debug?]]
    [raffle.google-auth :as auth]
    [raffle.events :as events]
    [day8.re-frame.http-fx]
    [re-frame.core :as rf]
    [raffle.app :as app]
    [raffle.api :as api]
    [reagent.core :as r]))

(defn- dev-setup []
  (when debug?
    (enable-console-print!)
    (println "Running in dev mode...")))

(defn- mount-app []
  (r/render [app/render] (.getElementById js/document "app")))

(defn ^:dev/after-load reload! []
  (rf/clear-subscription-cache!)
  (mount-app))

(def ^:private auth-options
  {:client_id     "611538057711-dia11nhabvku7cgd0edubeupju1jf4rg.apps.googleusercontent.com"
   :hosted_domain "miles.no"})

(defn ^:export init! []
  (api/enable-interceptors!)
  (rf/dispatch-sync [::events/init])
  (auth/load! auth-options)
  (dev-setup)
  (mount-app))
