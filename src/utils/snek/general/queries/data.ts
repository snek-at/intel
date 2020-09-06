//#region > Imports
//> GQL
// DocumentNode needed for queries
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
//#endregion

//#region > Exports
export { getGitlabServers };
//#endregion
