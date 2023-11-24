#!/usr/bin/env node

(async function run() {
  const legoFabricPrice = 9.9;
  const cliArguments = require('./cli-argument-parser.js')();
  global.cliArguments = cliArguments;

  if (cliArguments) {
    const itemId = cliArguments.itemId;
    const color = cliArguments.color;

    const { convertToBricklinkId } = require('./rebrickable/colorname-to-id-converter.js');

    const colorId = await convertToBricklinkId({ color });

    if (isNaN(colorId)) {
      console.log('Color not found!');
      return;
    }

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
  }
})();
