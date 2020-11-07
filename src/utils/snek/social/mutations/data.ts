//#region > Imports
//#PACKAGE "graphql-tag"
// GQL DocumentNode needed for queries
import gql from "graphql-tag";
//#endregion

//#region > Mutations
const follow = gql`
  mutation follow($token: String!, $person: String!, $personToFollow: String!) {
    followPerson(
      token: $token
      person: $person
      personToFollow: $personToFollow
    ) {
      totalFollowers
    }
  }
`;

const unfollow = gql`
  mutation unfollow(
    $token: String!
    $person: String!
    $personToUnfollow: String!
  ) {
    unfollowPerson(
      token: $token
      person: $person
      personToUnfollow: $personToUnfollow
    ) {
      totalFollowers
    }
  }
`;

const like = gql`
  mutation like($token: String!, $person: String!, $personToLike: String!) {
    likePerson(token: $token, person: $person, personToLike: $personToLike) {
      totalLikes
    }
  }
`;

const unlike = gql`
  mutation unlike($token: String!, $person: String!, $personToUnlike: String!) {
    unlikePerson(
      token: $token
      person: $person
      personToUnlike: $personToUnlike
    ) {
      totalLikes
    }
  }
`;

//#region > Exports
export { follow, unfollow, like, unlike };
//#endregion
