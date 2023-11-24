const axios = require('axios');

const apiKey = global.cliArguments.apiKey;

const loadBricklinkid = async (colorName) => {
  try {
    const colorId = await axios
      .get('https://rebrickable.com/api/v3/lego/colors/', {
        headers: {
          Authorization: `key ${apiKey}`,
        },
      })
      .then(({ data }) => {
        const color = data.results.find((color) => color.name === colorName);
        return color.external_ids.BrickLink?.ext_ids[0] ?? NaN;
      });

    return colorId;
  } catch (error) {
    console.error(error);
    return NaN;
  }
};

const convertToBricklinkId = ({ color }) => {
  return loadBricklinkid(color);
};

module.exports = { convertToBricklinkId };
