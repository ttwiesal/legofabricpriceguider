const cliParser = require('./cli-argument-parser.js');

describe('cli-argument-parser', () => {
  it.each([
    {
      argv: ['path', '--color="Bright Green"', '--apiKey=20', '--itemId=bar', '--username=user', '--password=password'],
      expected: { itemId: 'bar', color: 'Bright Green', apiKey: '20', username: 'user', password: 'password' },
    },
  ])('should return valid runner args', ({ argv, expected }) => {
    process.argv = argv;
    const args = cliParser();
    expect(args).toStrictEqual(expected);
  });
});
