(ns raffle.core
  (:require
    [raffle.utilities :refer [debug?]]
    [raffle.events :as events]
    [raffle.app :as app]
    [raffle.api :as api]
    [re-frame.core :as rf]
    [reagent.core :as r]
    [day8.re-frame.http-fx]))

(defn- dev-setup []
  (when debug?
    (enable-console-print!)
    (println "Running in dev mode...")))

(defn- mount-app []
  (r/render [app/render] (.getElementById js/document "app")))

(defn ^:dev/after-load reload! []
  (rf/clear-subscription-cache!)
  (mount-app))

(defn ^:export init! []
  (api/enable-interceptors!)
  (rf/dispatch-sync [::events/init])
  (dev-setup)
  (mount-app))
