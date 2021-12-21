const withTM = require("next-transpile-modules")([
  "@agility-mono-example/shared-components",
]); // pass the modules you would like to see transpiled

module.exports = withTM({});
