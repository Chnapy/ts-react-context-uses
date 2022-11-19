# ts-react-context-uses

[![npm](https://img.shields.io/npm/v/ts-react-context-uses)](https://www.npmjs.com/package/ts-react-context-uses)
[![license](https://img.shields.io/npm/l/ts-react-context-uses)](https://github.com/chnapy/ts-react-context-uses/blob/master/LICENSE)
[![CI - CD](https://github.com/Chnapy/ts-react-context-uses/actions/workflows/ci.yml/badge.svg)](https://github.com/Chnapy/ts-react-context-uses/actions/workflows/ci.yml)

TODO

-- react-context-uses => check l'utilisation d'un context, si à l'interieur de son provider --

- parcours d'AST
	- choix de la techno: TS (besoin typage)

- repérer les utilisation de React.useContext(X) et <X.Consumer>, vérifier leur présence dans <X.Provider>
- si condition non respectée, afficher les fichiers & lignes défaillantes + afficher erreur
- utilisable en CLI
- intégration éditeur

-----

-- TS language-service - react-context-uses

- context provider & hook can be imported from external modules, only type is accessible
- check TS AST then report error (warning ?) diagnostic
- context items should be created with identifiers
	- type ContextHook<H> = H & { _tsUses?: 'ProductContext'; };
	- type ContextProvider<P> = P & { _tsUses?: 'ProductContext'; };
  
