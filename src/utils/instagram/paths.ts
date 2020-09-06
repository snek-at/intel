export const USER_POSTS_PATH = `/me/media?fields=id`;
export const POST_DATA_PATH = (post_id: number) =>
  `/${post_id}?fields=id,media_type,media_url,username,timestamp,permalink`;

export const GEO_LOCATION_PATH = (locationName: string) =>
  `/search/?format=json&q=${locationName}`;
