#!/usr/bin/env node

(async function run() {
  const cliArguments = require('./cli-argument-parser.js')();
  global.cliArguments = cliArguments;

  if (cliArguments) {
    const inquirer = require('inquirer');
    const prompt = inquirer.createPromptModule();

    prompt([
      {
        type: 'list',
        name: 'mode',
        message: 'Select a mode',
        choices: [
          { name: 'Single part', value: 'guide-single' },
          { name: 'Rebrickable Partlist', value: 'guide-partlist' },
        ],
      },
    ]).then(async ({ mode }) => {
      const { guideForPartWithColorName, guideForPartlist } = require('./guider.js');
      if (mode === 'guide-single') {
        await guideForPartWithColorName(cliArguments.itemId, cliArguments.color);
      } else if (mode === 'guide-partlist') {
        await guideForPartlist('username', 'password');
      }
    });
  }
})();
