//#region > Imports
//#PACKAGE "graphql-tag"
// GQL DocumentNode needed for queries
import gql from "graphql-tag";
//#endregion

//#region > Queries
const getGitlabServers = gql`
  query gitLabServers($token: String!) {
    page(slug: "person-registration-form", token: $token) {
      ... on PersonRegistrationFormPage {
        supportedGitlabs {
          ... on GitlabServer {
            id
            organisation
            domain
          }
        }
      }
    }
  }
`;

const userExists = gql`
  query userExists($token: String!, $username: String!) {
    userExists(token: $token, username: $username)
  }
`;

//#endregion

//#region > Exports
export { getGitlabServers, userExists };
//#endregion
