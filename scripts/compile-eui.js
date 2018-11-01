const { execSync } = require('child_process');
const chalk = require('chalk');
const shell = require('shelljs');
const path = require('path');
const fs = require('fs');
const glob = require('glob');

function compileLib() {
  shell.mkdir('-p', 'lib/components', 'lib/services', 'lib/test');

  console.log('Compiling src/ to lib/');

  // Run all code (com|trans)pilation through babel (ESNext JS & TypeScript)
  // execSync('babel --out-dir=lib --extensions .js,.ts,.tsx --ignore "**/webpack.config.js,**/*.test.js,**/*.d.ts" src');

  console.log(chalk.green('✔ Finished compiling src/ to lib/'));

  // Use `tsc` to emit typescript declaration files for .ts files
  // execSync('tsc --noEmit false --outDir ./types --declaration --emitDeclarationOnly');

  console.log('Generating typescript definitions file');
  execSync(`node ${path.resolve(__dirname, 'dtsgenerator.js')}`);
  console.log(chalk.green('✔ Finished generating definitions'));

  // Also copy over SVGs. Babel has a --copy-files option but that brings over
  // all kinds of things we don't want into the lib folder.
  // shell.mkdir('-p', 'lib/components/icon/assets');

  // glob('./src/components/**/*.svg', undefined, (error, files) => {
  //   files.forEach(file => {
  //     const splitPath = file.split('/');
  //     const basePath = splitPath.slice(2, splitPath.length).join('/');
  //     shell.cp('-f', `${file}`, `lib/${basePath}`);
  //   });
  //
  //   console.log(chalk.green('✔ Finished copying SVGs'));
  // });

  // Copy hand-crafted *.d.ts declaration files
  glob('./src/*/**/*.d.ts', undefined, (error, files) => {
    files.forEach(file => {
      const splitPath = file.split('/');
      const basePath = splitPath.slice(2, splitPath.length).join('/');
      const dirPath = path.dirname(`types/${basePath}`);
      if (!fs.existsSync(dirPath)) {
        shell.mkdir('-p', dirPath);
      }

      const targetFilePath = path.join('types', basePath);
      if (!fs.existsSync(targetFilePath)) {
        shell.cp('-f', file, targetFilePath);
      }
    });

    console.log(chalk.green('✔ Finished copying TS declarations'));
  });
}

function compileBundle() {
  shell.mkdir('-p', 'dist');

  console.log('Building bundle...');
  execSync('webpack --config=src/webpack.config.js');

  console.log('Building minified bundle...');
  execSync('NODE_ENV=production webpack --config=src/webpack.config.js');
}

compileLib();
compileBundle();
