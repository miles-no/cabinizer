(ns raffle.macros)

(defmacro defstyled [name styles args & body]
  `(def ~name
     (raffle.material-ui.styles/with-style
       ~styles
       ^{:displayName ~(str name)}
       (fn ~args ~@body))))
