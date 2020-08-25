//#region > Imports
//> GQL
// DocumentNode needed for queries
import gql from "graphql-tag";
//#endregion

const getAchievements = gql`
  query achievements {
    achievements(token: "") {
      title
      collectors {
        ... on PersonFormPage {
          personname: slug
          firstname
          lastname
        }
      }
    }
  }
`;
