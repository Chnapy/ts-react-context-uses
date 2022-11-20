# ts-react-context-uses

[![npm](https://img.shields.io/npm/v/ts-react-context-uses)](https://www.npmjs.com/package/ts-react-context-uses)
[![license](https://img.shields.io/npm/l/ts-react-context-uses)](https://github.com/chnapy/ts-react-context-uses/blob/master/LICENSE)
[![CI - CD](https://github.com/Chnapy/ts-react-context-uses/actions/workflows/ci.yml/badge.svg)](https://github.com/Chnapy/ts-react-context-uses/actions/workflows/ci.yml)

TODO

---

-- ts-react-context-uses - CLI tool - check l'utilisation d'un context, si à l'interieur de son provider --

--

- CLI use only
- context provider & hook can be imported from external modules, only type is accessible

--

<!-- - définition typage & utils runtime-dev: traced-hook / traced-provider
  - `type TracedContextHook<H> = H & { _tsUses?: 'ProductContext'; };`
  - `type TracedContextProvider<P> = P & { _tsUses?: 'ProductContext'; };` -->

- generation ast multi-files
- parcours code via function calls or jsx render
  - accès imports packages monorepo
  - note des `<X.Provider>`
  - en cas de `useContext(X)` check la présence de `<X.Provider>`
    - else show last `<Component>` render file & line infos

---

-- tests

- ast
  - valid: calls & jsx-render tree
  - valid: file imports
  - valid: package imports
- single-file
  - valid: no useContext nor <X.Provider>
  - valid: only <X.Provider>
  - valid: useContext(X) inside <X.Provider>
  - valid: React.useContext(X) inside <X.Provider>
  - invalid: useContext(X) without provider
  - valid: useContext(X) inside useX() inside <X.Provider> inside <XProvider>
  - invalid: useContext(X) inside useX() without provider
  - invalid: custom function useContext(X) inside <X.Provider>
- multiple-files
  - valid: (file1) useContext(X) inside useX() inside (file2) <X.Provider> inside <XProvider>
- monorepo
  - valid: (p1) useContext(X) inside useX() inside (p2) <X.Provider> inside <XProvider>
