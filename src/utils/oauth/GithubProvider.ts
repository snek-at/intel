//#region > Imports
//> Guid Generator
// Contains a random guid generator
import GuidGenerator from "../../toolbox/GuidGenerator";
//> Interfaces
// Contains the interfaces for the provider functions
import { IProvider, ExtractedData } from "react-very-simple-oauth";
//> Config
// Contains the values for the provider
import Config from "./config.json";
//#endregion

//#region > Providers
// Set the default values needed for an OAuth-Request
const state = GuidGenerator();
let providerConfig = Config.providers.github;
let details = providerConfig.details.deploy;

const GithubProvider: IProvider<boolean> = {
  /**
   * Builds authorization url
   * 
   * @returns {string} The builded authorization url.
   * @description Build the authorization url for the OAuth-Request, the values are obtained from the config file.
   */
  buildAuthorizeUrl(): string {
    if (window.location.href.includes(Config.devUrl)) {
      details = providerConfig.details.dev;
    }

    return `${providerConfig.urls.authorizeUrl}${details.redirectUrl}
        &client_id=${details.clientId}
        &client_secret=${details.clientSecret}
        &scope=${details.scope}
        &state=${state}`;
  },
  /**
   * Extracts Error
   *
   * @param {string} redirectUrl A url that will be redirected to.
   * @returns {Error | undefined} Returns Error object, if there is an error.
   * @description Catch any error that appears during the OAuth process.
   */
  extractError(redirectUrl: string): Error | undefined {
    const errorMatch = redirectUrl.match(/error=([^&]+)/);

    if (!errorMatch) {
      return undefined;
    }

    const errorReason = errorMatch[1];
    const errorDescriptionMatch = redirectUrl.match(
      /error_description=([^&]+)/
    );

    const errorDescription = errorDescriptionMatch
      ? errorDescriptionMatch[1]
      : "";

    return new Error(
      `Error during login. Reason: ${errorReason} Description: ${errorDescription}`
    );
  },
  /**
   * Extracts Session
   *
   * @param {string} redirectUrl A url that will be redirected to.
   * @returns {Promise<ExtractedData | null>} The username and accessToken, if the request was successful.
   * @description Catches the accessToken and requests the username.
   */
  async extractSession(redirectUrl: string): Promise<ExtractedData | null> {
    let data: ExtractedData | null = null;
    let code = null;
    const codeMatch = redirectUrl.match(/code=([^&]+)/);

    if (codeMatch) {
      code = codeMatch[1];
    }

    let state = null;
    const stateMatch = redirectUrl.match(/state=([^&]+)/);

    if (stateMatch) {
      state = stateMatch[1];
    }

    const AuthorizeUrl = `${Config.proxyUrl}${providerConfig.urls.accessTokenUrl}${code}
        &client_secret=${details.clientSecret}&client_id=${details.clientId}&redirect_uri=${details.redirectUrl}&state=${state}`;

    /* POST request to get the access token from GitHub */
    await fetch(AuthorizeUrl, {
      headers: {
        Accept: "application/json",
        "Access-Allow-Credentials": "True",
        "Access-Control-Allow-Methods": "POST",
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
        Vary: "Origin"
      },
      method: "POST"
    })
      .then(async (res) => await res.json())
      .then(async (res) => {
        const accessToken = res.access_token;

        /* GET request to get the user used for OAuth */
        await fetch(`${providerConfig.urls.usernameUrl}`, {
          headers: {
            authorization: "Token " + accessToken
          }
        })
          .then(async (res) => await res.json())
          .then((res) => {
            data = { username: res.login, accessToken };

            return data;
          });
      });

    return data;
  }
};
//#endregion

//#region > Exports
export default GithubProvider;
//#endregion

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019-2020 Simon Prast
 */
