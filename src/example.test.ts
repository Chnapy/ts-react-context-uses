import { main } from './main';

describe('example', () => {
  it('foo', () => {
    const diagnostics = main(
      './example/tsconfig.json',
      require.resolve('../example/index.tsx'),
      'App'
    );

    console.log(
      'DIAGNOSTICS',
      diagnostics.map(({ file, ...rest }) => rest)
    );
  });
});
