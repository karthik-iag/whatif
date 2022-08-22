/**
 * build commands required to build the dist folder per environment
 */

export const appBuildCommands = ['dev', 'tst', 'stub', 'sit', 'perf'].map(
  (env) =>
    `NODE_ENV="${env}" npx parcel build src/multienv-app/index.html --public-url ./ --dist-dir dist/${env}`
);
