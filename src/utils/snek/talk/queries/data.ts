//#region > Imports
//> GQL
// DocumentNode needed for queries
import gql from "graphql-tag";
//#endregion

//#region > Queries
const getTalk = gql`
  query talk($token: String!, $id: Int!) {
    talk(token: $token, id: $id) {
      id
      title
      description
      path
      url
      updatedAt
      createdAt
      talkComments {
        id
        createdAt
        updatedAt
        text
        author {
          slug
          title
          firstName
          lastName
          status
          bio
          avatarImage {
            src
          }
        }
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

const getTalks = gql`
  query talks($token: String!, $personName: String) {
    talks(token: $token, personName: $personName) {
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
        author {
          slug
          title
          firstName
          lastName
          status
          bio
          avatarImage {
            src
          }
        }
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
export { getTalk, getTalks };
//#endregion
