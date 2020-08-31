//#region > Imports
//> GQL
// DocumentNode needed for queries
import gql from "graphql-tag";
//#endregion

//#region > Queries
const getProfiles = gql`
  query getProfiles($token: String!, $personName: String!) {
    personProfiles(token: $token, personName: $personName) {
      id
      createdAt
      updatedAt
      username
      accessToken
      sourceUrl
      sourceType
      isActive
    }
  }
`;
//#endregion

//#region > Exports
export { getProfiles };
//#endregion
