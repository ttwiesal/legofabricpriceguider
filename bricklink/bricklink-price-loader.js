const axios = require('axios');
const cheerio = require('cheerio');

const loadAveragePrice = async (itemId, colorId) => {
  try {
    const price = await axios
      .get(`https://www.bricklink.com/catalogPG.asp?P=${itemId}&ColorId=${colorId}`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
        },
      })
      .then(({ data }) => {
        const $ = cheerio.load(data);
        const specificSpan = $('table table:nth-child(5) tr:nth-child(3) td:nth-child(1) table tr:nth-child(4) b');
        return specificSpan.html().replace('EUR&nbsp;', '');
      });

    return price;
  } catch (error) {
    console.error(error);
    return 0;
  }
};

const loadPrice = ({ itemId, color }) => {
  return loadAveragePrice(itemId, color);
};

module.exports = { loadPrice };
