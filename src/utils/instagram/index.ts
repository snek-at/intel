//#region > Imports
import { InstagramClient } from "snek-client";
import { USER_POSTS_PATH, POST_DATA_PATH, GEO_LOCATION_PATH } from "./paths";
import { InstagramPost, FETCHING_ERROR } from "./types";
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
    const rate_limit_error: FETCHING_ERROR = {
      error: "RATE_LIMIT",
      errorMsg:
        "You are hitting rate-limits on the node that you are attempting to fetch. Please wait and try again later.",
    };

    /** Get all user posts with id */
    const posts: InstagramPost[] = await runner
      .getJson<{ data: { id: number }[] }>(USER_POSTS_PATH)
      .then(async (res) => {
        return await Promise.all(
          res.data.map((post) =>
            runner
              .getJson<{ permalink: string }>(POST_DATA_PATH(post.id))
              .then(async (postData) => {
                const text = await (
                  await fetch(postData.permalink, { method: "GET" })
                ).text();

                const content = new DOMParser().parseFromString(
                  text,
                  "text/html"
                );

                const meta = content.querySelectorAll(
                  '[type="application/ld+json"]'
                );
                console.log("META", meta);

                for (let data of meta) {
                  const parsedMeta = safelyParseJSON<
                    { contentLocation: { name: string } },
                    { contentLocation: undefined }
                  >(data.textContent, { contentLocation: undefined });

                  if (parsedMeta.contentLocation) {
                    return await (
                      await fetch(
                        "https://nominatim.openstreetmap.org" +
                          GEO_LOCATION_PATH(parsedMeta.contentLocation.name),
                        { method: "GET" }
                      )
                    )
                      .json()
                      .then(
                        (
                          res:
                            | { lon: string; lat: string }
                            | { lon: string; lat: string }[]
                        ) => {
                          return {
                            id: post.id,
                            permalink: postData.permalink,
                            meta: {
                              contentLocation: {
                                name: parsedMeta.contentLocation.name,
                                lon:
                                  res instanceof Array ? res[0]?.lon : res.lon,
                                lat:
                                  res instanceof Array ? res[0]?.lat : res.lat,
                              },
                            },
                          };
                        }
                      )
                      .catch(() => {
                        return { error: rate_limit_error };
                      });
                  }
                }

                return {
                  id: post.id,
                  permalink: postData.permalink,
                };
              })
              .catch(() => {
                return { error: rate_limit_error };
              })
          )
        );
      })
      .catch(() => {
        return [{ error: rate_limit_error }];
      });

    return posts;
  };
}
//#endregion

//#region > Exports
export default Provider;
//#endregion
