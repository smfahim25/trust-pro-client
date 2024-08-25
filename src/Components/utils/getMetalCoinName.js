// metalCoinName.js
const getMetalCoinName = (coinSymbol) => {
  let data = "";

  switch (coinSymbol) {
    case "ES":
      data = "S&P";
      break;
    case "GC":
      data = "XAU";
      break;
    case "SI":
      data = "XAG";
      break;
    case "CL":
      data = "WTI";
      break;
    case "PL":
      data = "XPT";
      break;
    case "AUDUSD":
      data = "AUD";
      break;

    case "GBPUSD":
      data = "GBP";
      break;

    case "CHFUSD":
      data = "CHF";
      break;

    case "EURUSD":
      data = "EUR";
      break;

    case "CADUSD":
      data = "CAD";
      break;

    case "JPYUSD":
      data = "JPY";
      break;

    case "90":
      data = "BTC";
      break;
    case "2679":
      data = "EOS";
      break;

    case "2":
      data = "Doge";
      break;

    case "257":
      data = "ADA";
      break;

    case "80":
      data = "ETH";
      break;

    case "1":
      data = "LTC";
      break;

    case "89":
      data = "XLM";
      break;

    case "2713":
      data = "TRX";
      break;

    case "2321":
      data = "BCH";
      break;
    case "58":
      data = "XRP";
      break;

    case "48543":
      data = "SOL";
      break;

    case "118":
      data = "ETC";
      break;

    default:
      data = coinSymbol;
      break;
  }
  return data;
};

export default getMetalCoinName;
