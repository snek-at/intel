export interface InstagramPost {
  id: number;
  permalink: string;
  mediaLink: string;
  mediaType: string;
  resolveLocation: () => Promise<
    | {
        name: string;
        lon: string;
        lat: string;
      }
    | {
        name: string;
        lon: undefined;
        lat: undefined;
      }
    | undefined
  >;
}
[];

export interface InstagramPosts {
  posts: InstagramPost[];
  next?: () => Promise<InstagramPosts>;
}
