export interface InstagramPost {
  id: number;
  permalink: string;
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
