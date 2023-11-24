const axios = require('axios');
const cheerio = require('cheerio');

const loadAveragePrice = async (itemId, colorId) => {
  try {
    const price = await axios
      .get(`https://www.bricklink.com/catalogPG.asp?P=${itemId}&ColorId=${colorId}`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
        },
      })
      .then(({ data }) => {
        const $ = cheerio.load(data);
        const specificSpan = $('table table:nth-child(5) tr:nth-child(3) td:nth-child(1) table tr:nth-child(4) b'); // tr:nth-child(4) td:nth-child(2) b');
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
