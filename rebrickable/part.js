const axios = require('axios');

const apiKey = global.cliArguments.apiKey;

const getColors = async (partId) => {
  try {
    const colors = await axios
      .get(`https://rebrickable.com/api/v3/lego/parts/${partId}/colors/`, {
        headers: {
          Authorization: `key ${apiKey}`,
        },
      })
      .then(({ data }) => {
        return data.results.map((color) => ({ id: color.color_id, name: color.color_name }));
      });

    return colors;
  } catch (error) {
    console.error(error);
    return [];
  }
};

module.exports = { getColors };
