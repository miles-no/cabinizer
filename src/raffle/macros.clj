(ns raffle.macros)

(defmacro defstyled [name styles args & body]
  `(defn ~name [~'props]
     (let [apply-style# (raffle.material-ui.styles/wrap ~styles)]
       (->>
         (fn ~args ~@body)
         (reagent.core/reactify-component)
         (apply-style#)
         (reagent.core/adapt-react-class)
         (conj [])))))
