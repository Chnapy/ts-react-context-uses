import { loadProjectFromPath } from './load-project-from-path';

describe.skip('load project from path', () => {
  it('todo', () => {
    expect(
      loadProjectFromPath(
        '/home/chnapy/projects/eslint-plugin-react-context-uses/extra/index.ts'
      )?.getSourceFiles()
    ).toHaveLength(1);
  });
});
