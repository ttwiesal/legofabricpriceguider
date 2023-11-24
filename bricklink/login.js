const axios = require('axios');
const login = async (username, password) => {
  try {
    const res = await axios.post(
      `https://www.bricklink.com/ajax/renovate/loginandout.ajax`,
      {
        userid: username,
        password: password,
      },
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/',
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        },
      },
    );
    console.log(res);
  } catch (error) {
    console.error(error);
  }
};

module.exports = { login };
