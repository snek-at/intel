//#region > Imports
import { InstagramClient, WebClient } from "snek-client";
import { USER_POSTS_PATH, POST_DATA_PATH, GEO_LOCATION_PATH } from "./paths";
import { InstagramPost } from "./types";
import { safelyParseJSON } from "../../toolbox/Parser";
//#endregion

//#region > Classes
class Provider {
  static processSource = async (
    instagramUrl: string,
    source: {
      /** Authorization: A token for authorizing the client */
      authorization: string;
    }
  ) => {
    const client = new InstagramClient(source.authorization, instagramUrl);
    const runner = await client.session.getRunner();
    /** Get all user posts with id */
    const posts: InstagramPost[] = await runner
      .getJson<{ data: { id: number }[] }>(USER_POSTS_PATH)
      .then(async (res) => {
        return await Promise.all(
          res.data.map((post) =>
            runner
              .getJson<{ permalink: string }>(POST_DATA_PATH(post.id))
              .then(async (postData) => {
                const webClient = new WebClient(postData.permalink);
                const content = await webClient.scraper.getDom("");
                const meta = content.querySelectorAll(
                  '[type="application/ld+json"]'
                );

                for (let data of meta) {
                  const parsedMeta = safelyParseJSON<
                    { contentLocation: string },
                    { contentLocation: undefined }
                  >(data.textContent, { contentLocation: undefined });

                  if (parsedMeta.contentLocation) {
                    //   return { id: post.id, permalink: postData.permalink, meta: parsed };
                    // post.meta = parsed;
                    const webClient = new WebClient(
                      "https://nominatim.openstreetmap.org"
                    );

                    return await webClient.scraper
                      .getJson<
                        | { lon: string; lat: string }
                        | { lon: string; lat: string }[]
                      >(GEO_LOCATION_PATH(parsedMeta.contentLocation))
                      .then(async (res) => {
                        return {
                          id: post.id,
                          permalink: postData.permalink,
                          meta: {
                            contentLocation: {
                              name: parsedMeta["contentLocation"],
                              lon: res instanceof Array ? res[0].lon : res.lon,
                              lat: res instanceof Array ? res[0].lat : res.lat,
                            },
                          },
                        };
                      });
                  }
                }

                return {
                  id: post.id,
                  permalink: postData.permalink,
                  meta: null,
                };
              })
          )
        );
      });

    return posts;
  };
}
//#endregion

//#region > Exports
export default Provider;
//#endregion
