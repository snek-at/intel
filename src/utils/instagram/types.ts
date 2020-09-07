export interface FETCHING_ERROR {
  error: string;
  errorMsg: string;
}

export interface InstagramPost {
  id?: number;
  permalink?: string;
  meta?: {
    contentLocation: {
      name: string;
      lon: string;
      lat: string;
    };
  };
  error?: FETCHING_ERROR;
}
