#!/usr/bin/env node

(async function run() {
  const cliArguments = require('./cli-argument-parser.js')();
  global.cliArguments = cliArguments;

  if (cliArguments) {
    const inquirer = require('inquirer');
    const prompt = inquirer.createPromptModule();

    let anotherRound = true;
    while (anotherRound) {
      await prompt([
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
          const { itemId, colorId, bricklinkPrizePer100g, weight, bricklinkPrice, buyInFabric, savings } = await guideForPartWithColorName(
            cliArguments.itemId,
            cliArguments.color,
          );
          console.log(`Item ID: ${itemId}`);
          console.log(`Color ID: ${colorId}`);

          console.log(`Bricklink average price last 6 Months: ${bricklinkPrice} EUR`);
          console.log(`Weight of piece: ${weight}g`);
          console.log(`100 Gramm Bricklink: ${bricklinkPrizePer100g} EUR`);

          if (buyInFabric) {
            console.log(`Buy from Lego Fabric! Savings: ${savings} EUR`);
          } else {
            console.log(`Buy from Bricklink! Savings: ${savings} EUR`);
          }
        } else if (mode === 'guide-partlist') {
          const guiding = await guideForPartlist(cliArguments.username, cliArguments.password);
          console.log(guiding);
        }
      });

      anotherRound = await prompt([
        {
          type: 'confirm',
          name: 'anotherRound',
          message: 'Another round?',
        },
      ]).then(({ anotherRound }) => {
        return anotherRound;
      });
    }
  }
})();
