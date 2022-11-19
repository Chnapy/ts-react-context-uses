import { PluginInit } from 'tsc-ls';
import TSL, { SyntaxKind } from 'typescript/lib/tsserverlibrary';
import { createLanguageServiceWithDiagnostics } from './language-service/create-language-service-proxy';
import { PluginConfig } from './plugin-config';
import { printNode } from 'ts-morph';

export const init: PluginInit = ({ typescript: ts }) => ({
  create: (info) => {
    const { project, languageService } = info;
    // const config = info.config as PluginConfig;

    // const directory = project.getCurrentDirectory();

    // logger.log('Plugin started');

    // logger.log(`Running in ${vsCodeEnv ? 'VS Code' : 'CLI'} env`);

    // logger.log(`Plugin config ${JSON.stringify(config)}`);

    const oldFn = languageService.getSemanticDiagnostics;
    languageService.getSemanticDiagnostics = (fileName) => {
      const res = oldFn(fileName);

      console.log('TOTOTO', fileName);

      if (fileName.includes('expect-errors')) {
        const pg = languageService.getProgram()!;
        const sf = pg.getSourceFile(fileName)!;

        const imports: TSL.ImportDeclaration[] = [];

        sf.forEachChild((node) => {
          if (TSL.isImportDeclaration(node)) {
            imports.push(node);
          }
        });

        const toto = JSON.stringify(sf.im);

        const logNode = (node: TSL.Node, level = 0) => {
          let str = '-';
          for (let i = 0; i < level; i++) {
            str += '-';
          }

          str += ` ${SyntaxKind[node.kind]}\n`;

          // if(TSL.isImportDeclaration(node)) {
          //   node.
          // }

          str += node
            .getChildren()
            .map((child) => logNode(child, level + 1))
            .join('');

          return str;
        };

        // sf.identifiers
        let refs = `${imports
          .map((imp) => imp.moduleSpecifier.getText())
          .join(',')}\n${logNode(sf)}`;

        refs += pg.getSourceFile(
          imports[1].moduleSpecifier.getText()
        )?.fileName;

        res.push({
          code: 0,
          category: TSL.DiagnosticCategory.Warning,
          file: sf,
          length: 1,
          messageText: `Foo ${refs}`,
          start: 0,
        });

        console.log(sf);
      }

      return res;
    };

    const languageServiceWithDiagnostics =
      createLanguageServiceWithDiagnostics(languageService);

    return languageServiceWithDiagnostics;
  },
});
