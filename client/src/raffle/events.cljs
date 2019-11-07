(ns raffle.events
  (:require
    [raffle.pages.phone-book.events :as phone-book]
    [raffle.pages.index.events :as index]
    [raffle.routing.fx :as routing]
    [re-frame.core :as rf]
    [raffle.api :as api]
    [ajax.core :as ajax]
    [raffle.db :as db]))

(def ^:private interceptors [rf/trim-v])

(rf/reg-event-fx
  ::init
  [interceptors]
  (fn []
    {:db db/initial}))

(defn- view->fx [{:keys [id params]}]
  (case id
    :phone-book {:dispatch [::phone-book/fetch-users]}
    :index {:dispatch [::index/fetch-items]}
    :item (println (str "Fetching item " (:id params) " from the server..."))
    nil))

(rf/reg-event-fx
  ::view-changed
  [interceptors]
  (fn [{:keys [db]} [view]]
    (merge
      {:db (assoc db :view view)}
      (view->fx view))))

(rf/reg-event-fx
  ::user-loaded
  [interceptors]
  (fn [{:keys [db]} [user]]
    {:db             (update db :user merge user)
     ::routing/start #(rf/dispatch [::view-changed %])}))

(rf/reg-event-fx
  ::user-signed-in
  [interceptors]
  (fn [{:keys [db]} [user]]
    {:db         (assoc db :user user)
     :http-xhrio {:method          :get
                  :uri             (api/service-url "/users/me")
                  :headers         {:Authorization (str "Bearer " (:idToken user))}
                  :response-format (ajax/json-response-format {:keywords? true})
                  :on-success      [::user-loaded]
                  :on-failure      [::load-user-failed]}}))
