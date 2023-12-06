#!/usr/bin/env node

(async function run() {
  const cliArguments = require('./cli-argument-parser.js')();
  global.cliArguments = cliArguments;

  if (cliArguments) {
    const inquirer = require('inquirer');
    const prompt = inquirer.createPromptModule();

    let anotherRound = true;

    const { login } = require('./bricklink/login.js');
    const loginCookies = await login(cliArguments.bricklinkUsername, cliArguments.bricklinkPassword);

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
        const { guideForSingle, guideForPartlist } = require('./guider.js');

        if (mode === 'guide-single') {
          await guideForSingle(cliArguments.itemId);
        } else if (mode === 'guide-partlist') {
          const guiding = await guideForPartlist(cliArguments.username, cliArguments.password, loginCookies);

          try {
            const fs = require('fs');
            const path = require('path');
            const csv = require('fast-csv');
            const csvStream = csv.format({ headers: true, delimiter: ';' });

            csvStream.pipe(fs.createWriteStream(path.join(__dirname, 'guiding.csv'), { encoding: 'utf8' }).on('error', (e) => console.error(e)));
            guiding.forEach((part) => {
              if (part.priceNotFound) return;

              csvStream.write({
                Name: part.name,
                Color: part.colorName,
                ColorId: part.colorId,
                'Bricklink Prize/100g': `${part.bricklinkPrizePer100g.toFixed(2)} EUR`,
                'Buy in fabric': part.buyInFabric,
                Savings: `${part.savings.toFixed(2)} EUR`,
              });
            });
            csvStream.end();
          } catch (e) {
            console.log('Could not export to csv');
            console.error(e);
          }

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
