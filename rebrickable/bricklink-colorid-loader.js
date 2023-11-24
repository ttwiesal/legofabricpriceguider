const axios = require('axios');

const apiKey = global.cliArguments.apiKey;

const getBricklinkColorId = async (color) => {
  try {
    const colors = await axios
      .get(`https://rebrickable.com/api/v3/lego/colors/${color}/`, {
        headers: {
          Authorization: `key ${apiKey}`,
        },
      })
      .then(({ data }) => {
        return data.external_ids.BrickLink.ext_ids[0];
      });

    return colors;
  } catch (error) {
    console.error(error);
    return '';
  }
};

module.exports = { getBricklinkColorId };
