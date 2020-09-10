//#region > Imports
//#PACKAGE "snek-client"
// Contains the clients for API calls to SNEK engines
import { SnekClient } from "snek-client";

//> Converters
import { general, ops } from "./converters/index";
//#endregion

class Provider {
  public static client = new SnekClient("http://localhost:8000/graphql");
  public static general: typeof general = require("./converters/general");
}

class OpsProvider extends Provider {
  public static ops: typeof ops = require("./converters/ops");
}

export { Provider, OpsProvider };
export default OpsProvider;
