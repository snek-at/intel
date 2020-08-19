//#region > Imports
import gql from "graphql-tag";
import { SnekSession } from "snek-client/lib/session/sessions";
import { mergeCodetransition, mergeContributionFeed } from "./tools";

//#endregion
export const getEnterprisePages = async (session: SnekSession) => {
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

  return session
    .customTask<{ page: { children: [] } }>("query", node, {})
    .then((res) => res.data?.page.children);
};

export const getEnterprisePageGeneralContent = async (
  session: SnekSession,
  queryArgs: { slug: string }
) => {
  const node = gql`
    query enterprisePageContent($slug: String!, $token: String!) {
      page(slug: $slug, token: $token) {
        ... on EnterpriseFormPage {
          name: title
          handle: slug
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
          assocConnectors: connectorScpPage {
            id
          }
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

  return session
    .customTask<{ page: { enterpriseCodetransitionStatistic: any[] } }>(
      "query",
      node,
      { ...queryArgs }
    )
    .then((res) => {
      const page: any = res?.data?.page;

      page.mergedEnterpriseCodetransitionStatistic = mergeCodetransition(
        page.enterpriseCodetransitionStatistic
      );

      page.mergedEnterpriseContributionFeed = mergeContributionFeed(
        page.enterpriseContributionFeed
      );

      return page;
    });
};

export const updateEnterprisePageGeneralContent = (
  session: SnekSession,
  queryArgs: {
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
  }
) => {
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

  return session
    .customTask<{ enterpriseFormPage: object }>("mutation", node, {
      values: {
        ...queryArgs.imprint,
        ...queryArgs.general,
      },
    })
    .then((res) => res.data?.enterpriseFormPage);
};

export const getEnterprisePageProjectsContent = (
  session: SnekSession,
  queryArgs: { slug: string }
) => {
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

  return session
    .customTask<{ page: { enterpriseProjects: [] } }>("query", node, {
      ...queryArgs,
    })
    .then((res) => {
      const projects = res.data?.page.enterpriseProjects;

      return projects?.map((project: any) => {
        project.mergedCodetransition = mergeCodetransition(
          project.codetransition
        );
        project.mergedContributionFeed = mergeContributionFeed(
          project.contributionFeed
        );
        return project;
      });
    });
};

export const getEnterprisePageUsersContent = (
  session: SnekSession,
  queryArgs: { slug: string }
) => {
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

  return session
    .customTask<{ page: { enterpriseContributors: [] } }>("query", node, {
      ...queryArgs,
    })
    .then((res) => {
      const users = res.data?.page.enterpriseContributors;

      return users?.map((user: any) => {
        user.mergedCodetransition = mergeCodetransition(user.codetransition);
        user.mergedContributionFeed = mergeContributionFeed(
          user.contributionFeed
        );
        return user;
      });
    });
};

//> Gitlabs
export const addGitlab = (
  session: SnekSession,
  queryArgs: {
    active: boolean;
    description: string;
    enterprisePageSlug: string;
    gitlabToken: string;
    name: string;
    privilegesMode: string;
    url: string;
  }
) => {
  const node = gql`
    mutation addGitlab(
      $token: String!
      $active: Boolean!
      $description: String!
      $enterprisePageSlug: String!
      $gitlabToken: String!
      $name: String!
      $privilegesMode: String!
      $url: String!
    ) {
      addGitlab(
        token: $token
        active: $active
        description: $description
        enterprisePageSlug: $enterprisePageSlug
        gitlabToken: $gitlabToken
        name: $name
        privilegesMode: $privilegesMode
        url: $url
      ) {
        gitlab {
          id
        }
      }
    }
  `;

  return session
    .customTask<{ addGitlab: { gitlab: { id: string } } }>("mutation", node, {
      ...queryArgs,
    })
    .then((res) => {
      return res.data?.addGitlab.gitlab;
    });
};

export const deleteGitlab = (
  session: SnekSession,
  queryArgs: { id: number }
) => {
  const node = gql`
    mutation deleteGitlab($token: String!, $id: Number!) {
      deleteGitlab(token: $token, id: $id) {
        success
      }
    }
  `;

  return session
    .customTask<{ deleteGitlab: { success: boolean } }>("mutation", node, {
      ...queryArgs,
    })
    .then((res) => {
      return res.data?.deleteGitlab;
    });
};

export const updateGitlab = (
  session: SnekSession,
  queryArgs: {
    id: number;
    active?: boolean;
    description?: string;
    enterprisePageSlug?: string;
    gitlabToken?: string;
    name?: string;
    privilegesMode?: string;
    url?: string;
  }
) => {
  const node = gql`
    mutation updateGitlab(
      $token: String!
      $id: Int!
      $active: Boolean!
      $description: String!
      $enterprisePageSlug: String!
      $gitlabToken: String
      $name: String!
      $privilegesMode: String!
      $url: String!
    ) {
      updateGitlab(
        token: $token
        id: $id
        active: $active
        description: $description
        enterprisePageSlug: $enterprisePageSlug
        gitlabToken: $gitlabToken
        name: $name
        privilegesMode: $privilegesMode
        url: $url
      ) {
        gitlab {
          id
        }
      }
    }
  `;

  return session
    .customTask<{ updateGitlab: { gitlab: { id: number } } }>(
      "mutation",
      node,
      {
        ...queryArgs,
      }
    )
    .then((res) => {
      return res.data?.updateGitlab.gitlab;
    });
};

export const getGitlabs = (session: SnekSession) => {
  const node = gql`
    query getGitlabs($token: String!) {
      gitlabs(token: $token) {
        id
        name
        description
        url
        token
        created
        updated
        active
        enterprisePage {
          title
          slug
        }
        privilegesMode
      }
    }
  `;

  return session.customTask<{ gitlabs: [] }>("query", node, {}).then((res) => {
    return res.data?.gitlabs;
  });
};

//> Pipelines
export const addPipeline = (
  session: SnekSession,
  queryArgs: {
    enterprisePageSlug: string;
    active: boolean;
    name: string;
    description: string;
  }
) => {
  const node = gql`
    mutation addPipeline(
      $token: String!
      $enterprisePageSlug: String!
      $name: String!
      $description: String!
      $active: Boolean!
    ) {
      addPipeline(
        token: $token
        enterprisePageSlug: $enterprisePageSlug
        name: $name
        description: $description
        active: $active
      ) {
        pipeline {
          id
        }
      }
    }
  `;
  return session
    .customTask<{ addPipeline: { pipeline: { id: string } } }>(
      "mutation",
      node,
      {
        ...queryArgs,
      }
    )
    .then((res) => {
      return res.data?.addPipeline.pipeline;
    });
};

export const deletePipeline = (
  session: SnekSession,
  queryArgs: { id: string }
) => {
  const node = gql`
    mutation deletePipeline($token: String!, $id: String!) {
      deletePipeline(token: $token, id: $id) {
        success
      }
    }
  `;

  return session
    .customTask<{ deletePipeline: { success: boolean } }>("mutation", node, {
      ...queryArgs,
    })
    .then((res) => {
      return res.data?.deletePipeline;
    });
};

export const updatePipeline = (
  session: SnekSession,
  queryArgs: {
    id: number;
    active?: boolean;
    description?: string;
    enterprisePageSlug?: string;
    name?: string;
  }
) => {
  const node = gql`
    mutation updatePipeline(
      $token: String!
      $id: String!
      $active: Boolean!
      $description: String!
      $enterprisePageSlug: String!
      $name: String!
    ) {
      updatePipeline(
        token: $token
        id: $id
        active: $active
        description: $description
        enterprisePageSlug: $enterprisePageSlug
        name: $name
      ) {
        pipeline {
          id
        }
      }
    }
  `;

  return session
    .customTask<{ updatePipeline: { pipeline: { id: string } } }>(
      "mutation",
      node,
      {
        ...queryArgs,
      }
    )
    .then((res) => {
      return res.data?.updatePipeline.pipeline;
    });
};

export const getPipelines = (session: SnekSession) => {
  const node = gql`
    query getPipelines($token: String!) {
      pipelines(token: $token) {
        id
        name
        description
        active
        created
        updated
        enterprisePage {
          title
          slug
        }
      }
    }
  `;

  return session
    .customTask<{ pipelines: [] }>("query", node, {})
    .then((res) => {
      return res.data?.pipelines;
    });
};

//> Connectors
export const addConnector = (
  session: SnekSession,
  queryArgs: {
    active: boolean;
    url: string;
    name: string;
    description: string;
    connectorToken: string;
    enterprisePageSlug: string;
    privilegesMode: string;
    settings: {};
    shareMode: string;
  }
) => {
  const node = gql`
    mutation addConnector(
      $token: String!
      $active: Boolean!
      $url: String!
      $name: String!
      $description: String!
      $connectorToken: String!
      $enterprisePageSlug: String!
      $privilegesMode: String!
      $settings: GenericScalar
      $shareMode: String!
    ) {
      addConnector(
        token: $token
        active: $active
        url: $url
        name: $name
        description: $description
        connectorToken: $connectorToken
        enterprisePageSlug: $enterprisePageSlug
        privilegesMode: $privilegesMode
        settings: $settings
        shareMode: $shareMode
      ) {
        connector {
          id
        }
      }
    }
  `;

  return session.begin().then(async () => {
    return session
      .customTask<{ addConnector: { connector: { id: string } } }>(
        "mutation",
        node,
        {
          ...queryArgs,
        }
      )
      .then((res) => {
        return res.data?.addConnector.connector;
      });
  });
};

export const deleteConnector = (
  session: SnekSession,
  queryArgs: { id: number }
) => {
  const node = gql`
    mutation deleteConnector($token: String!, $id: Int!) {
      deleteConnector(token: $token, id: $id) {
        success
      }
    }
  `;

  return session
    .customTask<{ deleteConnector: { success: boolean } }>("mutation", node, {
      ...queryArgs,
    })
    .then((res) => {
      return res.data?.deleteConnector;
    });
};

export const updateConnector = (
  session: SnekSession,
  queryArgs: {
    id: number;
    active?: boolean;
    connectorToken?: string;
    description?: string;
    enterprisePageSlug?: string;
    name?: string;
    privilegesMode?: string;
    settings?: {};
    shareMode?: string;
    url?: string;
  }
) => {
  const node = gql`
    mutation updateConnector(
      $token: String!
      $id: Int!
      $active: Boolean!
      $connectorToken: String!
      $description: String!
      $enterprisePageSlug: String!
      $name: String!
      $settings: GenericScalar!
      $shareMode: String!
      $url: String!
    ) {
      updateConnector(
        token: $token
        id: $id
        active: $active
        connectorToken: $connectorToken
        description: $description
        enterprisePageSlug: $enterprisePageSlug
        name: $name
        settings: $settings
        shareMode: $shareMode
        url: $url
      ) {
        connector {
          id
        }
      }
    }
  `;

  return session
    .customTask<{ updateConnector: { connector: { id: number } } }>(
      "mutation",
      node,
      {
        ...queryArgs,
      }
    )
    .then((res) => {
      return res.data?.updateConnector.connector;
    });
};

export const getConnectors = (session: SnekSession) => {
  const node = gql`
    query getConnectors($token: String!) {
      connectors(token: $token) {
        id
        name
        description
        url
        token
        created
        updated
        active
        enterprisePage {
          title
          slug
        }
        privilegesMode
        shareMode
        shareProjects
        shareUsers
        shareCompanyName
        shareCompanyRecruiting
        shareCompanyRecruementUrl
        shareCompanyDescription
        shareCompanyEmployeesCount
        shareCompanyVat
        shareCompanyEmail
        shareCompanyOpensourceStatus
        shareCompanyOpensourceUrl
      }
    }
  `;

  return session
    .customTask<{ connectors: [] }>("query", node, {})
    .then((res) => {
      return res.data?.connectors;
    });
};

export const publishEnterprisePageViaConnector = (
  session: SnekSession,
  queryArgs: {
    connectorId: number;
  }
) => {
  const node = gql`
    mutation publishToEnterpriseConnector($token: String!, $connectorId: Int!) {
      publishCompanyPage(token: $token, connectorId: $connectorId) {
        success
      }
    }
  `;

  return session
    .customTask<{ publishCompanyPage: { success: boolean } }>(
      "mutation",
      node,
      { ...queryArgs }
    )
    .then((res) => {
      return res.data?.publishCompanyPage.success;
    });
};
