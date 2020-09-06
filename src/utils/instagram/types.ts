export interface InstagramPost {
  id: number;
  permalink: string;
  meta: {
    contentLocation: {
      name: string;
      lon: string;
      lat: string;
    };
  } | null;
}
