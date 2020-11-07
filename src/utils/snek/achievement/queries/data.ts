//#region > Imports
//#PACKAGE "graphql-tag"
// GQL DocumentNode needed for queries
import gql from "graphql-tag";
//#endregion

const getAchievements = gql`
  query achievements($token: String!) {
    achievements(token: $token) {
      title
      description
      points
      image {
        src
      }
      collectors {
        firstName
        lastName
        title
        personName: slug
      }
    }
  }
`;

export { getAchievements };
