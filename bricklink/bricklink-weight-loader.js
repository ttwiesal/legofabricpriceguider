const axios = require('axios');
const cheerio = require('cheerio');

const loadBricklinkWeight = async (itemId) => {
  try {
    const weight = await axios
      .get(`https://www.bricklink.com/v2/catalog/catalogitem.page?P=${itemId}`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
        },
      })
      .then(({ data }) => {
        const $ = cheerio.load(data);
        const weightInfoSpan = $('#item-weight-info ');

        return weightInfoSpan.text().replace('g', '');
      });

    return weight;
  } catch (error) {
    console.error(error);
    return -1;
  }
};

const loadWeightInGramm = ({ itemId }) => {
  return loadBricklinkWeight(itemId);
};

module.exports = { loadWeightInGramm };
