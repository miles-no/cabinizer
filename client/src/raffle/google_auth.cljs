(ns raffle.google-auth
  (:require-macros [cljs.core.async.macros :as a])
  (:require [cljs.core.async :as a]
            [reagent.core :as r]
            [goog.dom :as dom]))

(defn- <cb [f & args]
  (let [out (a/chan)]
    (apply f (conj (into [] args) #(a/close! out)))
    out))

(defn- <promise [f & args]
  (let [out (a/chan)
        done (fn [& _] (a/close! out))]
    (.then (apply f args) done done)
    out))

(defn- <load-script [url]
  (a/go (let [s (dom/createElement "script")]
          (set! (.-src s) url)
          (let [loaded (<cb (fn [cb] (set! (.-onload s) cb)))]
            (.appendChild (.-body js/document) s)
            (a/<! loaded)))))

(defn- <init-gapi! [client-id]
  (assert client-id)
  (a/go
    (a/<! (<cb js/gapi.load "auth2"))
    (a/<! (<promise js/gapi.auth2.init #js {:client_id     client-id
                                            :hosted_domain "miles.no"}))))

(defn- <ensure-gapi! [client-id]
  (a/go
    (when-not (exists? js/gapi)
      (a/<! (<load-script "https://apis.google.com/js/platform.js")))
    (a/<! (<init-gapi! client-id))))

(defn <sign-out! []
  (<promise #(.signOut (js/gapi.auth2.getAuthInstance))))

(defn- render-signin-button [el {:keys [on-success on-failure]}]
  (js/gapi.signin2.render el
                          #js {:scope     "https://www.googleapis.com/auth/user.phonenumbers.read"
                               :width     240
                               :height    40
                               :longtitle false
                               :theme     "dark"
                               :onsuccess on-success
                               :onfailure on-failure}))

(defn signin-button [{:keys [client-id on-success on-failure]}]
  (r/create-class
    {:display-name        "signin-button"
     :component-did-mount (fn [this]
                            (let [el (r/dom-node this)]
                              (a/go
                                (a/<! (<ensure-gapi! client-id))
                                (render-signin-button el
                                                      {:on-success on-success
                                                       :on-failure on-failure}))))
     :reagent-render      (fn [] [:div])}))
