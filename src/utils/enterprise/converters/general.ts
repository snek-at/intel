//#region > Imports
import gql from "graphql-tag";
import Provider from "../index";

import { mergeCodetransition, mergeContributionFeed } from "../tools";
//#endregion

export const getEnterprisePages = async () => {
  const node = gql`
    query getAllCompanyPages($token: String!) {
      page(slug: "enterprise-pages", token: $token) {
        children {
          name: title
          handle: slug
        }
      }
    }
  `;

  return Provider.client.session
    .runner<{ page: { children: [] } }>("query", node, {})
    .then((res) => res.data?.page.children);
};

export const getEnterprisePageGeneralContent = async (queryArgs: {
  slug: string;
}) => {
  const node = gql`
    query enterprisePageContent($slug: String!, $token: String!) {
      page(slug: $slug, token: $token) {
        ... on EnterpriseFormPage {
          name: title
          handle: slug
          avatarImage {
            src
          }
          city
          zipCode
          address
          telephone
          telefax
          whatsappTelephone
          whatsappContactline
          email
          vatNumber
          taxId
          tradeRegisterNumber
          courtOfRegistry
          placeOfRegistry
          tradeRegisterNumber
          ownership
          employeeCount
          opensourceUrl
          recruitingUrl
          description
          enterpriseContributors {
            id
          }
          enterpriseCodelanguageStatistic {
            name
            type
            color
            primaryExtension
            insertions
            deletions
          }
          enterpriseCodetransitionStatistic {
            insertions
            deletions
            datetime
          }
          enterpriseContributionFeed {
            type
            cid
            datetime
            message
            files {
              insertions
              deletions
              path
              rawChanges
            }
          }
        }
      }
    }
  `;

  return Provider.client.session
    .runner<{ page: { enterpriseCodetransitionStatistic: any[] } }>(
      "query",
      node,
      { ...queryArgs }
    )
    .then((res) => {
      const page: any = JSON.parse(JSON.stringify(res?.data?.page));

      page.mergedEnterpriseCodetransitionStatistic = mergeCodetransition(
        page.enterpriseCodetransitionStatistic
      );

      page.mergedEnterpriseContributionFeed = mergeContributionFeed(
        page.enterpriseContributionFeed
      );

      return page;
    });
};

export const updateEnterprisePageGeneralContent = async (queryArgs: {
  slug: string;
  imprint: {
    city?: string;
    zip_code?: string;
    address?: string;
    telephone?: string;
    telefax?: string;
    vat_number?: string;
    whatsapp_telephone?: string;
    whatsapp_contactline?: string;
    tax_id?: string;
    trade_register_number?: string;
    court_of_registry?: string;
    place_of_registry?: string;
    ownership?: string;
    email?: string;
    employee_count?: string;
    opensource_url?: string;
    recruiting_url?: string;
    description?: string;
  };
  general: { title: string };
}) => {
  const node = gql`
    mutation updateEnterprisePageGeneralContent(
      $values: GenericScalar!
      $token: String!
    ) {
      enterpriseFormPage(
        values: $values
        token: $token
        url: "/enterprise-pages/${queryArgs.slug}"
      ) {
        result
      }
    }
  `;

  const res = await Provider.client.session.runner<{
    enterpriseFormPage: object;
  }>("mutation", node, {
    values: {
      ...queryArgs.imprint,
      ...queryArgs.general,
    },
  });

  return res.data?.enterpriseFormPage;
};

export const getEnterprisePageProjectsContent = async (queryArgs: {
  slug: string;
}) => {
  const node = gql`
    query enterprisePageContent($slug: String!, $token: String!) {
      page(slug: $slug, token: $token) {
        ... on EnterpriseFormPage {
          enterpriseProjects {
            id
            title: name
            url
            description
            ownerName
            ownerUsername
            ownerEmail
            contributors {
              name
              username
              active
              contributionFeed {
                type
                cid
                datetime
                message
                files {
                  insertions
                  deletions
                  path
                  rawChanges
                }
              }
              codelanguages {
                name
                type
                color
                primaryExtension
                insertions
                deletions
              }
              codetransition {
                insertions
                deletions
                datetime
              }
            }
            contributionFeed {
              type
              cid
              datetime
              message
              files {
                insertions
                deletions
                path
                rawChanges
              }
            }
            codelanguages {
              name
              type
              color
              primaryExtension
              insertions
              deletions
            }
            codetransition {
              insertions
              deletions
              datetime
            }
          }
        }
      }
    }
  `;

  const res = await Provider.client.session.runner<{
    page: { enterpriseProjects: [] };
  }>("query", node, {
    ...queryArgs,
  });

  const projects = JSON.parse(
    JSON.stringify(res.data?.page.enterpriseProjects)
  );

  return projects?.map((project: any) => {
    project.mergedCodetransition = mergeCodetransition(project.codetransition);
    project.mergedContributionFeed = mergeContributionFeed(
      project.contributionFeed
    );

    return project;
  });
};

export const getEnterprisePageUsersContent = async (queryArgs: {
  slug: string;
}) => {
  const node = gql`
    query enterprisePageContent($slug: String!, $token: String!) {
      page(slug: $slug, token: $token) {
        ... on EnterpriseFormPage {
          enterpriseContributors {
            name
            username
            active
            contributionFeed {
              type
              cid
              datetime
              message
              files {
                insertions
                deletions
                path
                rawChanges
              }
            }
            codelanguages {
              name
              type
              color
              primaryExtension
              insertions
              deletions
            }
            codetransition {
              insertions
              deletions
              datetime
            }
          }
        }
      }
    }
  `;

  const res = await Provider.client.session.runner<{
    page: { enterpriseContributors: [] };
  }>("query", node, {
    ...queryArgs,
  });

  const users = JSON.parse(
    JSON.stringify(res.data?.page.enterpriseContributors)
  );

  return users?.map((user: any) => {
    user.mergedCodetransition = mergeCodetransition(user.codetransition);
    user.mergedContributionFeed = mergeContributionFeed(user.contributionFeed);

    return user;
  });
};
