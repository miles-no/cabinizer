(ns raffle.db)

(def test-items
  (->>
    (range 10)
    (map (fn [id]
           {:id          id
            :name        (str "Item " id)
            :description (str "This is item number " id)
            :image-url   "https://source.unsplash.com/random"}))
    (vec)))

(def initial
  {:view  {:id :phone-book}
   :items test-items})
