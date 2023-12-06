const sleep = async (ms) => new Promise((res) => setTimeout(res, ms));

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

  const guidance = [];
  for (const { itemId, colorId } of partlist) {
    await sleep(3000);
    guidance.push(await guideForPartWithColorId(itemId, colorId));
  }

  return guidance;
};

const guideForSingle = async (defaultItemId) => {
  const inquirer = require('inquirer');
  const prompt = inquirer.createPromptModule();

  const { item } = await prompt([
    {
      type: 'input',
      name: 'item',
      message: 'Item ID',
      default: defaultItemId,
    },
  ]);

  const { getColors } = require('./rebrickable/part.js');
  const availableColors = await getColors(item);

  const colorChoices = availableColors.map((color) => ({ name: color.name, value: color.id }));
  const { color } = await prompt([
    {
      type: 'list',
      name: 'color',
      message: 'Select a color',
      choices: colorChoices,
    },
  ]);

  const { getBricklinkColorId } = require('./rebrickable/bricklink-colorid-loader.js');
  const bricklinkColorId = await getBricklinkColorId(color);

  const { itemId, colorId, bricklinkPrizePer100g, weight, bricklinkPrice, buyInFabric, savings } = await guideForPartWithColorId(item, bricklinkColorId);
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
};
module.exports = { guideForSingle, guideForPartlist };
