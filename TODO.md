# FIX
- Review TWDA radar: remove swarm, maybe replace?

# FEATURES

# FEATURES ON HOLD
- TWD search with % V5-compatibility -> after BCP clarify V5
- Deck details show % V5-compatibility -> after BCP clarify V5
- Indicator of inventory-perfect decks in selector -> performance issue for many decks
- Legacy style in PDF select card -> all legacy to be available
- Draft Cube support -> when draft cube info is available

# TECH IMPROVEMENTS
- Update to React 19:
  - forwardRef
  - useOptimistic
  - Forms to useFormStatus/useActionState
  - <Contex.Provider> to <Context>
  - useContext to use
  - use can be conditional => useApp can be updated (use in utils instead of props drilling, update hooks)
- Update to TailwindCSS 4
- Migrate to useSWR (test on playtest reports)
- Migrate from isWidth to container queries
- Migrate forms to useFormStatus/useActionState
- Remove legacy polyfills (2024-11-30 groupBy 87.24%)
