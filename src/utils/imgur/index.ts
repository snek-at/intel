//#region > Imports
import { WebClient } from "snek-client";

//> Config
import Config from "../../config.json";
import { IMAGE_PATH } from "./paths";
//#endregion

//#region > Classes
class Provider {
  public static client = new WebClient("https://api.imgur.com/3", {
    Authorization: `Client-ID ${Config.utils.imgur.clientSecret}`,
  });

  public static async upload(file: File) {
    const formData = new FormData();

    formData.append("image", file);

    const image = (
      await this.client.scraper.post<{
        data: { link: string; deletehash: string };
      }>(IMAGE_PATH, formData)
    ).data;

    return image;
  }

  public static async delete(deletehash: string) {
    const data = (
      await this.client.scraper.fetchJson<{ data: any }>(
        `${IMAGE_PATH}/${deletehash}`,
        "DELETE"
      )
    ).data;

    if (data) {
      return true;
    }

    return false;
  }
}
//#endregion

//#region > Exports
export default Provider;
//#endregion
