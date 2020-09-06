//#region > Imports
//> GQL
// DocumentNode needed for queries
import gql from "graphql-tag";
//#endregion

//#region > Mutations
const registration = gql`
  mutation registration($token: String!, $values: GenericScalar!) {
    registration: personRegistrationFormPage(
      url: "/person-registration-form/"
      token: $token
      values: $values
    ) {
      result
      errors {
        name
        errors
      }
    }
  }
`;

const addProfile = gql`
  mutation addProfile(
    $token: String!
    $personName: String!
    $accessToken: String!
    $sourceUrl: String!
    $sourceType: String!
    $username: String!
  ) {
    addProfile(
      token: $token
      personName: $personName
      accessToken: $accessToken
      sourceUrl: $sourceUrl
      sourceType: $sourceType
      username: $username
    ) {
      profile {
        id
        createdAt
      }
    }
  }
`;

const deleteProfile = gql`
  mutation deleteProfile($token: String!, $profileId: String!) {
    deleteProfile(token: $token, profileId: $profileId) {
      profiles {
        id
      }
    }
  }
`;

const updateProfile = gql`
  mutation updateProfile(
    $token: String!
    $profileId: String!
    $accessToken: String
    $sourceUrl: String
    $sourceType: String
    $username: String
  ) {
    updateProfile(
      token: $token
      profileId: $profileId
      accessToken: $accessToken
      sourceUrl: $sourceUrl
      sourceType: $accessToken
      username: $username
    ) {
      profile {
        id
      }
    }
  }
`;

const writeVariableStore = gql`
  mutation writeVariableStore(
    $token: String!
    $personName: String!
    $rawCurrentStatistic: JSONString
    $rawLanguages: JSONString
    $rawOrganisations: JSONString
    $rawProjects: JSONString
    $rawYearsStatistic: JSONString
  ) {
    variableStore(
      token: $token
      personName: $personName
      rawCurrentStatistic: $rawCurrentStatistic
      rawLanguages: $rawLanguages
      rawOrganisations: $rawOrganisations
      rawProjects: $rawProjects
      rawYearsStatistic: $rawYearsStatistic
    ) {
      person {
        id
      }
    }
  }
`;

const updatePersonPage = gql`
  mutation updatePersonPage(
    $token: String!
    $personName: String!
    $avatarImage: String
    $bio: String
    $display2dCalendar: Boolean
    $display3dCalendar: Boolean
    $displayEmail: Boolean
    $displayProgrammingLanguages: Boolean
    $displayRanking: Boolean
    $displayWorkplace: Boolean
    $email: String
    $firstName: String
    $lastName: String
    $location: String
    $movablePool: JSONString
    $status: String
    $websiteUrl: String
    $workplace: String
  ) {
    updatePersonPage(
      token: $token
      personName: $personName
      avatarImage: $avatarImage
      bio: $bio
      display2dCalendar: $display2dCalendar
      display3dCalendar: $display3dCalendar
      displayEmail: $displayEmail
      displayProgrammingLanguages: $displayProgrammingLanguages
      displayRanking: $displayRanking
      displayWorkplace: $displayWorkplace
      email: $email
      firstName: $firstName
      lastName: $lastName
      location: $location
      movablePool: $movablePool
      status: $status
      websiteUrl: $websiteUrl
      workplace: $workplace
    ) {
      personPage {
        ... on PersonPage {
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
      }
    }
  }
`;

const addMetaLink = gql`
  mutation addMetaLink(
    $token: String!
    $personName: String!
    $url: String!
    $location: String
    $linkType: String
    $imgurDeleteHash: String
    $description: String
  ) {
    addMetaLink: addPersonPageMetaLink(
      token: $token
      personName: $personName
      url: $url
      location: $location
      linkType: $linkType
      imgurDeleteHash: $imgurDeleteHash
      description: $description
    ) {
      metaLink {
        id
        url
        linkType
        location
        description
        imgurDeleteHash
      }
    }
  }
`;

const deleteMetaLink = gql`
  mutation deleteMetaLink($token: String!, $metaLinkId: String!) {
    deleteMetaLink: deletePersonPageMetaLink(
      token: $token
      metaLinkId: $metaLinkId
    ) {
      metaLinks {
        id
        url
        linkType
        location
        description
        imgurDeleteHash
      }
    }
  }
`;

//#region > Exports
export {
  registration,
  addProfile,
  deleteProfile,
  updateProfile,
  writeVariableStore,
  updatePersonPage,
  addMetaLink,
  deleteMetaLink,
};
//#endregion
