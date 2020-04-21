
<p align="center">
  <a href="https://snek.at/" target="_blank" rel="noopener noreferrer">
    <img src="https://avatars2.githubusercontent.com/u/55870326?s=400&u=c6c7f06305ddc94747d474850fde7b2044f53838&v=4" alt="SNEK Logo" height="150">
  </a>
</p>

<h3 align="center">SNEKNetwork for Engineers and Knowledged</h3>
<p align="center">
The SNEK project is an attempt to create a transparent, open-source non-profit platform that allows engineers to categorize and compare. It should enable engineers from adjacent fields to visualize each other's skills through visualization and project identification.
  <br>
Intel serves as the :green_heart: of SNEK. Intel is the central data processing system for SNEK, providing interfaces to connect our other systems.
  <br>
  <br>
  <a href="https://github.com/snek-at/intel/issues/new?template=bug_report.md">Report bug</a>
  ·
  <a href="https://github.com/snek-at/intel/issues/new?template=feature_request.md">Request feature</a>
  ·
  <a href="https://www.overleaf.com/read/bcxwhwbhrmps">Documentation</a>
  <br>
  <br>
  <a href="https://www.codacy.com/app/kleberbaum/intel">
  </a>
</p>
 
 [![Codacy Badge](https://api.codacy.com/project/badge/Grade/b0224ced616347beb703d9330867b5d5)](https://app.codacy.com/gh/snek-at/intel?utm_source=github.com&utm_medium=referral&utm_content=snek-at/intel&utm_campaign=Badge_Grade_Dashboard)
## Table of contents

- [Installation](#installation)
- [Features](#features)
- [Usage](#usage)
- [Contributing](#contributing)
- [Bugs and feature requests](#bugs-and-feature-requests)
- [Versioning](#versioning)
- [Creators](#creators)
- [Thanks](#thanks)
- [Copyright and license](#copyright-and-license)

## [](#installation)Installation
The system can be installed using the ```npm install``` command:
```bash
$ npm install snek-client
```

## [](#features)Features
- GitLab Querying
- GitHub Querying
- Statistics Generation
- Interface with various GraphQL APIs
- OAuth2-Authentication
- Session Management

## [](#usage)Usage
### Source Object
```typescript=
/* GitHub Source Object */
let source = {
  user: "schettn",
  platform: { name: "github", url: "https://api.github.com/graphql" },
  authorization: "token XXXXXXXXXXXXXXXX",
};

/* GitLab Source Object */
let source = {
  user: "schettn",
  platform: { name: "gitlab", url: "https://gitlab.com" },
};
```
### Append Source Object to Database
```typescript=
await intel.append(source);
```
### Append List of Source Object to Database
```typescript=
await intel.appendList([source1, source2]);
```
### Get Reduced Data from Database
```typescript=
let data = intel.get();
```
### Reset Database
This will erase all datasets in the databse.
```typescript=
intel.resetReducer();
```
### Sessions
Session are completely handled by the Intel. 
```typescript=
/* 
 * Starts the session for an anonymous user or maintains the session if
 * a user is logged in.
 */
await intel.snekclient.session.begin();
/*
 * Overrides an active session with a new session using the credential
 * pair.
 */
await intel.snekclient.session.begin({
  username: "schettn",
  password: "tschischkotschicko",
});
/* Ends the session */
await intel.snekclient.session.end();

```
### Tasks
All tasks are session aware! Every task has the capability of token handeling. Modifying a token is not suggested.
```typescript=
/** Authorization Tasks */
/* Login an anonymous user on the snek-engine */
let userData =
    await intel.snekclient.session.tasks.auth.anon();
/* Login a real user on the snek-engine */
let userData =
    await intel.snekclient.session.tasks.auth.nonanon();
/* Refresh the user tokens on the snek-engine */
let refreshState =
    await intel.snekclient.session.tasks.auth.refresh();
/* Revoke the user tokens on the snek-engine */
let revokeState =
    await intel.snekclient.session.tasks.auth.revoke();
    

/** Authorization Tasks */
/* Get all profile pages from snek-engine  */
let pagesData =
    await intel.snekclient.session.tasks.general.allPageUrls();
/* Get all GitLab servers from the snek-engine */
let gitlabServerData =
    await intel.snekclient.session.tasks.general.gitlabServer();


/** Authorization Tasks */
/* Get all GitLab servers from the snek-engine */
let cachePageData =
    await intel.snekclient.session.tasks.user.cache();
/* Get the profile page data from the snek-engine */
let profilePageData =
    await intel.snekclient.session.tasks.user.profile();
/* Get the registration data from snek-engine */
let registrationData =
    await intel.snekclient.session.tasks.user.registration();
/* Get the whoami data from snek-engine */
let whoamiData =
    await intel.snekclient.session.tasks.user.whoami();
```

### OAuth2
#### Config File
The client ID, the client secret and the redirect URL are provided through an OAuth organization. To change this file, one has to clone the repository and manually create a new config file.
```json=
{
  "providers": {
    "github": {
      "details": {
        "dev": {
          "clientId": "1440dd4c1d1c4c0fa124",
          "clientSecret": "0723a2b5bfef27efc8b2d26d837ead239fa0b0e6",
          "redirectUrl": "http://localhost:3000/redirect",
          "scope": "repo, user:email, read:user, read:org"
        },
        "deploy": {
          "clientId": "b4337a9c1ad66984c060",
          "clientSecret": "1b05648d36ca92d63766e32e8e9a7d740b214816",
          "redirectUrl": "https://snek.at/redirect",
          "scope": "repo, user:email, read:user, read:org"
        }
      },
      "urls": {
        "authorizeUrl": "https://github.com/login/oauth/authorize?redirect_uri=",
        "accessTokenUrl": "https://github.com/login/oauth/access_token?code=",
        "usernameUrl": "https://api.github.com/user"
      }
    }
  },
  "proxyUrl": "https://cors.snek.at/",
  "devUrl": "http://localhost:3000"
}
```
<mark>Currently, a solution to adapt the config file more easily is being developed.</mark>

#### Imlementation
##### Redirect page
Put this script inside your redirect page to obtain the access token from the OAuth2 request. 
```javascript=
/*
 * The redirect script:
 * Get name of window which was set by the parent to be the unique
 * request key
 */
const requestKey = window.name;
// Update corresponding entry with the redirected url which should
// contain either access token or failure reason in the query
// parameter / hash
localStorage.setItem(requestKey, window.location.href);
window.close();
```
##### Requesting access token
```javascript=
/* Import GithubProvider and the RSA */
import RSA, { GithubProvider } from "snek-intel/utils/oauth";

/* Gets the username and accessToken */
const openGitHubOAuth = () => {
    return await RSA.acquireTokenAsync(GithubProvider)
};
/* Example on how to call the GitHub OAuth function */
const { data } = openGitHubOAuth();
console.log(data.username, data.accessToken)
```
## [](#contributing)Contributing
![GitHub last commit](https://img.shields.io/github/last-commit/snek-at/intel) ![GitHub issues](https://img.shields.io/github/issues-raw/snek-at/intel) ![GitHub closed issues](https://img.shields.io/github/issues-closed-raw/snek-at/intel?color=green)

Please read through our [contributing guidelines](https://github.com/snek-at/front/blob/master/CONTRIBUTING.md). Included are directions for opening issues, coding standards, and notes on development.

All HTML and CSS should conform to the [Code Guide](https://github.com/mdo/code-guide), maintained by [Mark Otto](https://github.com/mdo).

## [](#bug-and-feature-requests)Bugs and feature requests

Have a bug or a feature request? Please first search for existing and closed issues. If your problem or idea is not addressed yet, [please open a new issue](https://github.com/snek-at/package-template/issues/new/choose).

## [](#versioning)Versioning
![GitHub package.json version](https://img.shields.io/github/package-json/v/snek-at/intel)

For transparency into our release cycle and in striving to maintain backward compatibility, this repository is maintained under [the Semantic Versioning guidelines](https://semver.org/). Sometimes we screw up, but we adhere to those rules whenever possible.

## [](#creators)Creators
<table border="0">
	<tr>
		<td>
		<a href="https://github.com/schettn">
			<img src="https://avatars.githubusercontent.com/schettn?s=100" alt="Avatar schettn">
		</a>
		</td>
		<td>
			<a href="https://github.com/pinterid">
				<img src="https://avatars.githubusercontent.com/pinterid?s=100" alt="Avatar pinterid">
			</a>
		</td>	
		<td>
			<a href="https://github.com/kleberbaum">
				<img src="https://avatars.githubusercontent.com/kleberbaum?s=100" alt="Avatar kleberbaum">
			</a>
		</td>
	</tr>
	<tr>
		<td><a href="https://github.com/schettn">Nico Schett</a></td>
		<td><a href="https://github.com/pinterid">David Pinterics</a></td>
		<td><a href="https://github.com/kleberbaum">Florian Kleber</a></td>
	</tr>
</table>

## [](#thanks)Thanks
We do not have any external contributors yet, but if you want your name to be here, feel free to [contribute to our project](#contributing).

## [](#copyright-and-license)Copyright and license
![GitHub repository license](https://img.shields.io/badge/license-EUPL--1.2-blue)

SPDX-License-Identifier: (EUPL-1.2)
Copyright © 2019-2020 Simon Prast
