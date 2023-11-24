const axios = require('axios');

const apiKey = global.cliArguments.apiKey;

const getPartLists = async ({ usertoken }) => {
  try {
    const { data } = await axios.get(`https://rebrickable.com/api/v3/users/${usertoken}/partlists/`, {
      headers: {
        Authorization: `key ${apiKey}`,
      },
    });

    return data.results;
  } catch (error) {
    console.error(error);
    return [];
  }
};

const getParts = async ({ usertoken, partlistid }) => {
  try {
    const { data } = await axios.get(`https://rebrickable.com/api/v3/users/${usertoken}/partlists/${partlistid}/parts`, {
      headers: {
        Authorization: `key ${apiKey}`,
      },
    });

    return data.results;
  } catch (error) {
    console.error(error);
    return [];
  }
};

module.exports = { getPartLists, getParts };
