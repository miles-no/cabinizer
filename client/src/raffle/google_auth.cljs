(ns raffle.google-auth
  (:require-macros [cljs.core.async.macros :as a])
  (:require
    [raffle.events :as events]
    [cljs.core.async :as a]
    [re-frame.core :as rf]
    [reagent.core :as r]
    [goog.dom :as dom]))

(defn- <cb [f & args]
  (let [out (a/chan)]
    (apply f (conj (into [] args) #(a/close! out)))
    out))

(defn- <promise [f & args]
  (let [out (a/chan)
        done (fn [args]
               (when args
                 (a/put! out args))
               (a/close! out))]
    (.then (apply f args) done done)
    out))

(defn- <load-script [url]
  (a/go (let [s (dom/createElement "script")]
          (set! (.-src s) url)
          (let [loaded (<cb (fn [cb] (set! (.-onload s) cb)))]
            (.appendChild (.-body js/document) s)
            (a/<! loaded)))))

(defn load! [opts]
  (a/go
    (a/<! (<load-script "https://apis.google.com/js/platform.js"))
    (a/<! (<cb js/gapi.load "auth2"))
    (let [auth2 (a/<! (<promise js/gapi.auth2.init (clj->js opts)))]
      (-> auth2
          (.-currentUser)
          (.listen #(rf/dispatch [::events/user-changed %])))
      (when (-> auth2 (.-isSignedIn) (.get))
        (a/<! (<promise #(.signIn auth2))))
      (rf/dispatch [::events/loading :auth false]))))

(defn sign-in! []
  (a/go (a/<! (<promise #(.signIn (js/gapi.auth2.getAuthInstance))))))

(defn sign-out! []
  (a/go (a/<! (<promise #(.signOut (js/gapi.auth2.getAuthInstance))))))
