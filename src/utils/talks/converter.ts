//#region > Imports
//> Models
// Contains the talk model
import { Talk } from "../../reducer/database/models";
//#endregion

//#region > Functions
/**
 * @function
 * @param rawData
 * @description Converter for talk data from the Github APIv3
 */
async function run(rawData: any) {
  console.log(rawData);
  rawData.talks.forEach((item: any) => {
    let displayUrl = "https://docs.google.com/viewer?embedded=true&url=";
    let downloadUrl;
    
    if (item.displayUrl) {
      displayUrl += item.displayUrl;
      downloadUrl = item.downloadUrl;
    } else {
      downloadUrl = item.html_url.replace("/blob/", "/raw/");
      displayUrl += downloadUrl;
    }

    const talk = {
      name: item.name,
      url: item.html_url,
      displayUrl,
      downloadUrl,
      path: item.path
    };

    const repository = {
      name: item.repository.name,
      url: item.repository.html_url,
      avatarUrl: item.repository.owner.avatar_url,
      owner: {
        avatarUrl: item.repository.owner.avatar_url,
        url: item.repository.owner.url,
        fullname: item.repository.owner.fullname,
        username: item.repository.owner.username
      }
    };

    Talk.objects.create({
      ...talk,
      repositoryData: JSON.stringify(repository)
    });
  });
}
//#endregion

//#region > Exports
export { run };
//#endregion

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019-2020 Simon Prast
 */
