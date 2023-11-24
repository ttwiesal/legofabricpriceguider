# legofabricpriceguider

Compares bricklink prices to lego fabric "100g" prices.

## Prerequisites

- Install [nodejs](https://nodejs.org/en/)
- Get [rebrickable](https://rebrickable.com/) api key

## Usage

```powershell
node .\index.js --apiKey=<rebrickableapikey> --itemId=<bricklinkpartid> --color=<rebrickablecolorname>
```

| Option     | Description            |
| ---------- | ---------------------- |
| `--apiKey` | Rebrickable api key    |
| `--itemId` | Bricklink part id      |
| `--color`  | Rebrickable color name |

## Running unit tests

Run `npm test` to execute the unit tests via [Jest](https://jestjs.io/).

## Linting

Run `npm run lint` to lint the project using [ESLint](https://eslint.org/).

## License

The project is licensed under the [MIT License](LICENSE).
