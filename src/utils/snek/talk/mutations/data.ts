//#region > Imports
//> GQL
// DocumentNode needed for queries
import gql from "graphql-tag";
//#endregion

//#region > Mutations
const addTalk = gql`
  mutation addTalk(
    $token: String!
    $personName: String!
    $title: String!
    $description: String
    $displayUrl: String
    $downloadUrl: String
    $path: String
    $url: String
  ) {
    addTalk(
      token: $token
      personName: $personName
      title: $title
      description: $description
      displayUrl: $displayUrl
      downloadUrl: $downloadUrl
      path: $path
      url: $url
    ) {
      talk {
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
  }
`;

const deleteTalk = gql`
  mutation deleteTalk($token: String!, $talkId: ID!) {
    deleteTalk(token: $token, talkId: $talkId) {
      talks {
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
  }
`;

const updateTalk = gql`
  mutation updateTalk(
    $token: String!
    $talkId: String!
    $title: String
    $description: String
    $displayUrl: String
    $downloadUrl: String
    $path: String
    $url: String
  ) {
    updateTalk(
      token: $token
      talkId: $talkId
      title: $title
      description: $description
      displayUrl: $displayUrl
      downloadUrl: $downloadUrl
      path: $path
      url: $url
    ) {
      talks {
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
  }
`;

const addTalkComment = gql`
  mutation addTalkComment(
    $token: String!
    $personName: String!
    $talkId: ID!
    $replyToId: ID
    $text: String
  ) {
    addTalkComment(
      token: $token
      personName: $personName
      talkId: $talkId
      replyToId: $replyToId
      text: $text
    ) {
      comment {
        id
        createdAt
        updatedAt
        author {
          avatarImage {
            src
          }
          title
          slug
        }
        text
      }
    }
  }
`;

const deleteTalkComment = gql`
  mutation deleteTalkComment($token: String!, $commentId: ID!) {
    deleteTalkComment(token: $token, commentId: $commentId) {
      comments {
        id
        createdAt
        updatedAt
        author {
          avatarImage {
            src
          }
          title
          slug
        }
        text
      }
    }
  }
`;

const updateTalkComment = gql`
  mutation updateTalkComment($token: String!, $commentId: ID!, $text: String) {
    updateTalkComment(token: $token, commentId: $commentId, text: $text) {
      comment {
        id
        createdAt
        updatedAt
        author {
          avatarImage {
            src
          }
          title
          slug
        }
        text
      }
    }
  }
`;
//#endregion

//#region > Exports
export {
  addTalk,
  deleteTalk,
  updateTalk,
  addTalkComment,
  deleteTalkComment,
  updateTalkComment,
};
//#endregion
