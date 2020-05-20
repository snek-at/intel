//#region > Imports
//## npm install snek-client
// Contains a client for web calls
import { WebClient } from "snek-client";
//#endregion

//#region > Interfaces
/**
 * @todo Convert this to a generic file interface
 * @interface Talk defines the structure of a not converted talk object
 */
interface ITalk {
  name: string;
  displayUrl: string | null;
  downloadUrl: string | null;
  html_url: string;
  path: string;
  /** @todo Remove repository from the interface */
  repository: {
    name: string;
    full_name: string;
    html_url: string;
    owner: {
      avatar_url: string;
    };
  };
}
//#endregion

//#region > Functions
/**
 * @function
 * @param {string} url The url that contains the download URL
 * @returns {string | null} The download URL if available
 * @description Extracts the download URL from a download site
 */
async function getDownloadUrl(url: string): Promise<string | null> {
  const webClient = new WebClient(url);
  /*
   * The url with which the web client was initialized already contains the endpoint url,
   * therefore the path no longer has to be specified explicitly.
   */
  let dom = await webClient.scraper.getDom("");

  return dom.getElementsByTagName("a")[1].getAttribute("href");
}

/**
 * @function
 * @param {Blob} file A file to be uploaded
 * @returns {ITalk} A unconverted talk object
 * @description Uploads a file to anonfile and returns a talk
 */
async function uploadFile(file: Blob) {
  let webClient = new WebClient("https://api.anonfiles.com/");
  let data = new FormData();

  data.append("file", file);

  const response = await webClient.scraper.post<{
    data: { file: { metadata: { name: string }; url: { short: string } } };
  }>("upload", data);

  const downloadUrl = await getDownloadUrl(response.data.file.url.short);

  const talk: ITalk = {
    name: response.data.file.metadata.name,
    displayUrl: downloadUrl,
    downloadUrl: downloadUrl,
    html_url: response.data.file.url.short,
    path: "",
    repository: {
      name: "",
      full_name: "",
      html_url: "",
      owner: {
        avatar_url: "",
      },
    },
  };

  return talk;
}
//#endregion

//#region > Exports
export { uploadFile, getDownloadUrl };
//#endregion

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019-2020 Simon Prast
 */
