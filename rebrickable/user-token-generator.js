const axios = require('axios');

const apiKey = global.cliArguments.apiKey;

const generateUserToken = async (username, password) => {
  try {
    const data = { password, username };

    const { user_token } = await axios.post('https://rebrickable.com/api/v3/users/_token/', data, {
      headers: {
        Authorization: `key ${apiKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    return user_token;
  } catch (error) {
    console.error(error);
    return '';
  }
};

const generateToken = ({ userName, password }) => {
  return generateUserToken(userName, password);
};

module.exports = { generateToken };
