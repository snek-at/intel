//#region > Imports
import { InstagramClient } from "snek-client";
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
          res.data.map(async (post) => {
            const postData = await runner.getJson<{
              permalink: string;
              media_url: string;
              media_type: string;
            }>(POST_DATA_PATH(post.id));

            const resolveLocation = async () => {
              try {
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

                for (let data of meta) {
                  const parsedMeta = safelyParseJSON<
                    { contentLocation: { name: string } },
                    { contentLocation: undefined }
                  >(data.textContent, { contentLocation: undefined });

                  if (parsedMeta.contentLocation) {
                    try {
                      const location:
                        | { lon: string; lat: string }
                        | { lon: string; lat: string }[] = await (
                        await fetch(
                          "https://nominatim.openstreetmap.org" +
                            GEO_LOCATION_PATH(parsedMeta.contentLocation.name),
                          { method: "GET" }
                        )
                      ).json();

                      return {
                        name: parsedMeta.contentLocation.name,
                        lon:
                          location instanceof Array
                            ? location[0]?.lon
                            : location.lon,
                        lat:
                          location instanceof Array
                            ? location[0]?.lat
                            : location.lat,
                      };
                    } catch {
                      return {
                        name: parsedMeta.contentLocation.name,
                      };
                    }
                  }
                }
              } catch {
                return undefined;
              }
            };

            return {
              id: post.id,
              permalink: postData.permalink,
              mediaLink: postData.media_url,
              mediaType: postData.media_type,
              resolveLocation,
            };
          })
        );
      });

    return posts;
  };
}
//#endregion

//#region > Exports
export default Provider;
//#endregion
