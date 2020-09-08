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
    }
  }
`;

//#region > Exports
export { redeem };
//#endregion
