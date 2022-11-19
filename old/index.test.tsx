import { RuleTester } from 'eslint';
import * as rule from './index';
import { readFileSync } from 'node:fs';

const testFilesPaths = {
  // eslintConfig: require.resolve('../.eslintrc.js'),
  useContextNoProvider: require.resolve(
    './test-files/invalid/use-context-no-provider.jsx'
  ),
};

const foo = Symbol();
const bar = Symbol();

const toto = { [Symbol()]: 5 };
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const tata: typeof toto = { [Symbol()]: 5 };

const ruleTester = new RuleTester({
  parserOptions: {
    program: {
      type: 'Program',
      aaaabc: 12,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
});

// RuleTester.only(item)

ruleTester.run('ts-react-context-uses', rule, {
  invalid: [
    // {
    //   name: 'React.useContext without provider',
    //   code: readFileSync(testFilesPaths.useContextNoProvider, 'utf8'),
    //   errors: 2,
    // },
    {
      name: 'TOTO',
      code: 'import { foo } from "./toto";\nfoo();',
      errors: 1,
    },
  ],
  valid: [],
});
