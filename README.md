[![CI](https://github.com/ttwiesal/legofabricpriceguider/actions/workflows/ci.yml/badge.svg)](https://github.com/ttwiesal/legofabricpriceguider/actions/workflows/ci.yml)

# legofabricpriceguider

Compares bricklink prices to lego fabric "100g" prices.

## Prerequisites

- Install [nodejs](https://nodejs.org/en/)
- Get [rebrickable](https://rebrickable.com/) api key

## Usage

```powershell
node .\index.js --apiKey=<rebrickableapikey> --itemId=<bricklinkpartid> --color=<rebrickablecolorname> --username=<rebrickableusername> --password=<rebrickablepassword>
```

| Option                | Description            | Required                      |
| --------------------- | ---------------------- | ----------------------------- |
| `--apiKey`            | Rebrickable api key    | Yes                           |
| `--itemId`            | Bricklink part id      | No                            |
| `--color`             | Rebrickable color name | No                            |
| `--username`          | Rebrickable username   | Yes, when using partlist mode |
| `--password`          | Rebrickable password   | Yes, when using partlist mode |
| `--bricklinkUsername` | Bricklink username     | Yes, when using partlist mode |
| `--bricklinkPassword` | Bricklink password     | Yes, when using partlist mode |

## Running unit tests

Run `npm test` to execute the unit tests via [Jest](https://jestjs.io/).

## Linting

Run `npm run lint` to lint the project using [ESLint](https://eslint.org/).

## License

The project is licensed under the [MIT License](LICENSE).
