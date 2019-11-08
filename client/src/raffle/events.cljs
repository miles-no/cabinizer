(ns raffle.events
  (:require
    [raffle.pages.phone-book.events :as phone-book]
    [raffle.pages.index.events :as index]
    [raffle.routing.fx :as routing]
    [raffle.utilities :as utils]
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

(rf/reg-event-db
  ::loading
  [interceptors]
  (fn [db [key loading?]]
    (utils/set-loading db key loading?)))

(rf/reg-event-fx
  ::user-changed
  [interceptors]
  (fn [_ [user]]
    (if-let [auth-response (.getAuthResponse user true)]
      {:dispatch [::user-signed-in user (.-id_token auth-response)]}
      {:dispatch [::user-signed-out]})))

(rf/reg-event-fx
  ::user-signed-in
  [interceptors]
  (fn [{:keys [db]} [user id-token]]
    (let [profile (.getBasicProfile user)
          user {:familyName (.getFamilyName profile)
                :givenName  (.getGivenName profile)
                :pictureUrl (.getImageUrl profile)
                :email      (.getEmail profile)
                :id         (.getId profile)
                :idToken    id-token}]
      {:db         (assoc db :user user)
       :http-xhrio {:method          :get
                    :uri             (api/service-url "/users/me")
                    :headers         {:Authorization (str "Bearer " id-token)}
                    :response-format (ajax/json-response-format {:keywords? true})
                    :on-success      [::user-loaded]
                    :on-failure      [::load-user-failed]}})))

(rf/reg-event-db
  ::user-signed-out
  [interceptors]
  (fn [db _]
    (dissoc db :user)))
