const chalk = require('chalk');

const validator = {
  set: function (obj, prop, value) {
    if (prop === 'apiKey') {
      if (!value) throw new Error('No apiKey set! Use --apiKey');
    }

    obj[prop] = value;
    return true;
  },
};

const parseAllCliArguments = function () {
  const args = {};
  process.argv.slice(1).map((element) => {
    const matches = element.match('--([a-zA-Z0-9]+)=?(.*)');
    if (matches) {
      args[matches[1]] = matches[2] ? matches[2].replace(/^['"]/, '').replace(/['"]$/, '') : true;
    }
  });
  return args;
};

const getCliArguments = () => {
  const { color, itemId, apiKey } = parseAllCliArguments();

  try {
    const validatedArgs = new Proxy({}, validator);
    validatedArgs.itemId = itemId;
    validatedArgs.apiKey = apiKey;
    validatedArgs.color = color;
    return validatedArgs;
  } catch (error) {
    console.error(chalk.bold.bgRed(error.message));
  }
};

module.exports = getCliArguments;
