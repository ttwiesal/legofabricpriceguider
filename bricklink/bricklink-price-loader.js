const axios = require('axios');
const cheerio = require('cheerio');

const loadMinPrice = async (itemId, colorId) => {
  try {
    //Alle preise für deutschland GET https://www.bricklink.com/ajax/clone/catalogifs.ajax?itemid=17756&color=11&cond=N&loc=DE&iconly=0
    const price = await axios
      .get(`https://www.bricklink.com/ajax/clone/catalogifs.ajax?itemid=${itemId}&color=${colorId}&cond=N&loc=DE&iconly=0`, {
        headers: {
          'Sec-Ch-Ua': '"Google Chrome";v="119", "Chromium";v="119", "Not?A_Brand";v="24"',
          referer: `https://www.bricklink.com/v2/catalog/catalogitem.page?P=${itemId}`,
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/',
        },
      })
      .then(({ data }) => {
        console.log(data);
        return data.list[0].mInvSalePrice;
      });

    return price;
  } catch (error) {
    console.error(error);
    return 0;
  }
};

const loadAveragePrice = async (itemId, colorId) => {
  try {
    const price = await axios
      .get(`https://www.bricklink.com/catalogPG.asp?P=${itemId}&ColorId=${colorId}`, {
        headers: {
          'Sec-Ch-Ua': '"Google Chrome";v="119", "Chromium";v="119", "Not?A_Brand";v="24"',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
          referer: `https://www.bricklink.com/v2/catalog/catalogitem.page?P=${itemId}`,
        },
      })
      .then(({ data }) => {
        const $ = cheerio.load(data);
        const specificSpan = $('table table:nth-child(5) tr:nth-child(3) td:nth-child(1) table tr:nth-child(4) b').html();
        if (specificSpan) {
          return specificSpan.replace('EUR&nbsp;', '');
        }

        console.error('No price data found for item ' + itemId);
        return NaN;
      })
      .catch((error) => {
        console.error(error);
        return NaN;
      });

    return price;
  } catch (error) {
    console.error(error);
    return NaN;
  }
};

const loadPrice = ({ itemId, color }) => {
  return loadAveragePrice(itemId, color);
};

module.exports = { loadPrice };
