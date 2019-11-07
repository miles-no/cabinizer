(ns raffle.components
  (:require
    ["@material-ui/core/Link" :default Link]
    [raffle.routing.core :as routing]
    [reagent.core :as r]))

(defn- button-link [{:keys [to params query replace? target] :as props} children]
  (let [navigate! (if replace? routing/replace! routing/navigate!)
        self-target? (or (nil? target) (= target "_self"))
        location (routing/resolve to params query)]
    (letfn [(-on-click [event]
              (let [left-button? (= (.-button event) 0)
                    modified? (or (.-metaKey event) (.-altKey event) (.-ctrlKey event) (.-shiftKey event))]
                (when (and left-button? self-target? (not modified?))
                  (.preventDefault event)
                  (navigate! to params query))))]
      (let [props* (r/merge-props props
                                  {:on-click -on-click
                                   :variant  :button
                                   :href     location})]
        [:> Link props* children]))))