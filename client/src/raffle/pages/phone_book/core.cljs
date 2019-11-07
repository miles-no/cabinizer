(ns raffle.pages.phone-book.core
  (:require-macros [raffle.macros :refer [defstyled]])
  (:require
    ["@material-ui/core/CircularProgress" :default CircularProgress]
    ["@material-ui/core/TablePagination" :default TablePagination]
    ["@material-ui/core/FormControl" :default FormControl]
    ["@material-ui/core/InputLabel" :default InputLabel]
    ["@material-ui/core/Typography" :default Typography]
    ["@material-ui/core/TableBody" :default TableBody]
    ["@material-ui/core/TableCell" :default TableCell]
    ["@material-ui/core/TableHead" :default TableHead]
    ["@material-ui/core/TableRow" :default TableRow]
    ["@material-ui/core/MenuItem" :default MenuItem]
    ["@material-ui/core/Toolbar" :default Toolbar]
    ["@material-ui/core/Select" :default Select]
    ["@material-ui/core/Avatar" :default Avatar]
    ["@material-ui/core/Paper" :default Paper]
    ["@material-ui/core/Table" :default Table]
    [raffle.pages.phone-book.events :as events]
    [raffle.pages.phone-book.subs :as subs]
    [re-frame.core :as rf]
    [reagent.core :as r]))

(declare phone-book-entry)

(defn- phone-book-style [theme]
  #js {:paper         #js {:margin-top (.spacing theme 2)}
       :loaderWrapper #js {:height          700
                           :display         "flex"
                           :flex-wrap       "wrap"
                           :flex-direction  "column"
                           :justify-content "center"
                           :align-items     "center"}
       :loaderText    #js {:margin (.spacing theme 2)}
       :tableWrapper  #js {:max-height 700
                           :overflow   "auto"}
       :officeSelect  #js {:min-width 200
                           :margin    (.spacing theme 2)}})

(defstyled phone-book phone-book-style [{:keys [^js classes]}]
  (let [users (rf/subscribe [::subs/users])
        page-number (r/atom 1)
        page-size (r/atom 25)
        office (r/atom "/")]
    (fn [{:keys [^js classes]}]
      [:> Paper
       {:class (.-paper classes)}
       (if @users
         [:<>
          [:> Toolbar
           [:> FormControl
            {:class (.-officeSelect classes)}
            [:> InputLabel
             {:id :office-select-label}
             "Office"]
            [:> Select
             {:labelId       :office-select-label
              :on-change     (fn [event]
                               (let [value (.. event -target -value)]
                                 (rf/dispatch [::events/fetch-users
                                               {:orgUnitPath (reset! office value)
                                                :size        @page-size
                                                :page        @page-number}])))
              :default-value @office}
             [:> MenuItem {:value "/"} "All"]
             [:> MenuItem {:value "/_Bergen"} "Bergen"]
             [:> MenuItem {:value "/_Oslo"} "Oslo"]
             [:> MenuItem {:value "/_Stavanger"} "Stavanger"]
             [:> MenuItem {:value "/_Trondheim"} "Trondheim"]
             [:> MenuItem {:value "/_Johannesburg"} "Johannesburg"]]]]
          [:div
           {:class (.-tableWrapper classes)}
           [:> Table
            {:stickyHeader true}
            [:> TableHead
             [:> TableRow
              [:> TableCell "Picture"]
              [:> TableCell "Name"]
              [:> TableCell "Email"]
              [:> TableCell "Phone No."]
              [:> TableCell "Department"]]]
            [:> TableBody
             (for [{:keys [id] :as entry} (:items @users)]
               [phone-book-entry
                {:key     id
                 :entry   entry
                 :classes classes}])]]]
          [:> TablePagination
           {:count               (:totalItemCount @users)
            :page                (dec (:pageNumber @users))
            :onChangePage        (fn [_ new-page]
                                   (rf/dispatch [::events/fetch-users
                                                 {:orgUnitPath @office
                                                  :size        @page-size
                                                  :page        (reset! page-number (inc new-page))}]))
            :onChangeRowsPerPage (fn [event]
                                   (rf/dispatch [::events/fetch-users
                                                 {:orgUnitPath @office
                                                  :size        (reset! page-size (.. event -target -value))
                                                  :page        (reset! page-number 1)}]))
            :rowsPerPage         @page-size
            :component           :div}]]
         [:div
          {:class (.-loaderWrapper classes)}
          [:> CircularProgress]
          [:> Typography
           {:class (.-loaderText classes)}
           "Loading phone book..."]])])))

(defn- phone-book-entry [{:keys [entry ^js classes]}]
  [:> TableRow
   [:> TableCell
    [:> Avatar
     {:src (str (:pictureUrl entry) "?size=40")
      :alt (:fullName entry)}]]
   [:> TableCell
    {:component :th
     :scope     :row}
    (str (:familyName entry) ", " (:givenName entry))]
   [:> TableCell
    [:a
     {:href (str "mailto:" (:email entry))}
     (:email entry)]]
   [:> TableCell
    [:a
     {:href (str "tel:" (:phoneNumber entry))}
     (:phoneNumber entry)]]
   [:> TableCell (:department entry)]])
