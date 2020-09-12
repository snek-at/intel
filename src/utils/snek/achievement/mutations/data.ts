//#region > Imports
//> GQL
// DocumentNode needed for queries
import gql from "graphql-tag";
//#endregion

//#region > Mutations
const redeem = gql`
  mutation redeem($token: String!, $personName: String!, $sequence: String!) {
    redeemAchievement(
      token: $token
      personName: $personName
      sequence: $sequence
    ) {
      ok
      achievement {
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
  }
`;

//#region > Exports
export { redeem };
//#endregion
