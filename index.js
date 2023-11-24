#!/usr/bin/env node

(async function run() {
  const cliArguments = require('./cli-argument-parser.js')();
  global.cliArguments = cliArguments;

  if (cliArguments) {
    const { generateToken } = require('./rebrickable/user-token-generator.js');
    const usertoken = await generateToken({ username: 'pewkachu', password: '' });

    const { getPartLists, getParts } = require('./rebrickable/part-list.js');
    const partLists = await getPartLists({ usertoken });

    const partlist = await getParts({ usertoken, partlistid: 556307 });
    console.log(partlist[0].part);
    console.log(partlist[0].color);

    // const itemId = cliArguments.itemId;
    // const color = cliArguments.color;

    // const { convertToBricklinkId } = require('./rebrickable/colorname-to-id-converter.js');

    // const colorId = await convertToBricklinkId({ color });

    // if (isNaN(colorId)) {
    //   console.log('Color not found!');
    //   return;
    // }

    // const { guideForPart } = require('./guider.js');
    // await guideForPart(itemId, colorId);
  }
})();
