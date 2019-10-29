(ns raffle.macros)

(defmacro defstyled [name styles args & body]
  `(def ~name
     (raffle.material-ui.styles/wrap
       ^{:displayName ~(str name)}
       (fn ~args ~@body)
       ~styles)))
