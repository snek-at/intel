//#region > Imports
//> GQL
// DocumentNode needed for queries
import gql from "graphql-tag";
//#endregion

//#region > Queries
const getTalks = gql`
  query talks($token: String!) {
    talks(token: $token) {
      id
      title
      description
      path
      url
      talkComments {
        id
        createdAt
        updatedAt
        text
        replies {
          id
        }
        talk {
          id
        }
      }
      owner {
        avatarImage {
          src
        }
        title
        slug
      }
      displayUrl
      downloadUrl
    }
  }
`;

const getPersonTalks = gql`
  query personTalks($token: String!, $personName: String!) {
    personTalks(token: $token, personName: $personName) {
      id
      title
      description
      path
      url
      talkComments {
        id
        createdAt
        updatedAt
        text
        replies {
          id
        }
        talk {
          id
        }
      }
      owner {
        avatarImage {
          src
        }
        title
        slug
      }
      displayUrl
      downloadUrl
    }
  }
`;
//#endregion

//#region > Exports
export { getTalks, getPersonTalks };
//#endregion
