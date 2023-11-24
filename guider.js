const guideForPartWithColorId = async (itemId, colorId) => {
  const legoFabricPrice = 9.9;
  const { loadPrice } = require('./bricklink/bricklink-price-loader.js');
  const pricePerPiece = await loadPrice({ itemId, color: colorId });

  //get grams of item
  const { loadWeightInGramm } = require('./bricklink/bricklink-weight-loader.js');
  const weightInGramm = await loadWeightInGramm({ itemId });

  // pieces to match 100gramm
  const pieces = 100 / weightInGramm;
  const pricePer100g = pieces * pricePerPiece;

  console.log(`Lego Fabric price: ${legoFabricPrice} EUR`);
  console.log(`Bricklink average price last 6 Months: ${pricePerPiece} EUR`);
  console.log(`Weight of piece: ${weightInGramm}g`);
  console.log(`100 Gramm Bricklink: ${pricePer100g} EUR`);

  if (pricePer100g < legoFabricPrice) {
    console.log(`Buy from Bricklink! Savings: ${(pricePer100g - legoFabricPrice) * -1} EUR`);
  } else {
    console.log(`Buy from Lego Fabric! Savings: ${(legoFabricPrice - pricePer100g) * -1} EUR`);
  }
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

  partlist.forEach(async ({ itemId, colorId }) => {
    await guideForPartWithColorId(itemId, colorId);
    setTimeout(() => {}, 1000);
  });
};

module.exports = { guideForPartWithColorName, guideForPartlist };
