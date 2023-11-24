const guideForPartWithColorId = async (itemId, colorId) => {
  const legoFabricPrice = 9.9;
  const { loadPrice } = require('./bricklink/bricklink-price-loader.js');
  const pricePerPiece = await loadPrice({ itemId, color: colorId });
  if (pricePerPiece === 0) {
    console.log('Price not found!');
    return { itemId, colorId };
  }

  //get grams of item
  const { loadWeightInGramm } = require('./bricklink/bricklink-weight-loader.js');
  const weightInGramm = await loadWeightInGramm({ itemId });

  // pieces to match 100gramm
  const pieces = 100 / weightInGramm;
  const pricePer100g = pieces * pricePerPiece;

  return {
    itemId,
    colorId,
    bricklinkPrizePer100g: pricePer100g,
    weight: weightInGramm,
    bricklinkPrice: pricePerPiece,
    buyInFabric: pricePer100g > legoFabricPrice,
    savings: pricePer100g > legoFabricPrice ? pricePer100g - legoFabricPrice : legoFabricPrice - pricePer100g,
  };
};

const guideForPartWithColorName = async (itemId, color) => {
  const { convertToBricklinkId } = require('./rebrickable/colorname-to-id-converter.js');

  const colorId = await convertToBricklinkId({ color });

  if (isNaN(colorId)) {
    console.log('Color not found!');
    return;
  }

  return guideForPartWithColorId(itemId, colorId);
};

const guideForPartlist = async (username, password) => {
  const inquirer = require('inquirer');
  const prompt = inquirer.createPromptModule();

  const { generateToken } = require('./rebrickable/user-token-generator.js');
  const usertoken = await generateToken({ username, password });

  const { getPartLists, getBricklinkParts } = require('./rebrickable/part-list.js');
  const partLists = await getPartLists({ usertoken });

  const partlistchoices = partLists.map((partlist) => ({ name: partlist.name, value: partlist.id }));

  const { partlistid } = await prompt([
    {
      type: 'list',
      name: 'partlistid',
      message: 'Select a partlist',
      choices: partlistchoices,
    },
  ]);

  const partlist = await getBricklinkParts({ usertoken, partlistid });
  const sleep = async (ms) => new Promise((res) => setTimeout(res, ms));

  const guidance = [];
  for (const { itemId, colorId } of partlist) {
    await sleep(1000);
    guidance.push(await guideForPartWithColorId(itemId, colorId));
  }

  return guidance;
};

module.exports = { guideForPartWithColorName, guideForPartlist };
