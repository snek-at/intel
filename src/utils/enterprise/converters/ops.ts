//#region > Imports
import gql from "graphql-tag";
import Provider from "../index";
//#endregion

//> Gitlabs
export const addGitlab = async (queryArgs: {
  active: boolean;
  description: string;
  enterprisePageSlug: string;
  gitlabToken: string;
  name: string;
  privilegesMode: string;
  url: string;
}) => {
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

  const res = await Provider.client.session.runner<{
    addGitlab: { gitlab: { id: string } };
  }>("mutation", node, {
    ...queryArgs,
  });

  return res.data?.addGitlab.gitlab;
};

export const deleteGitlab = async (queryArgs: { id: number }) => {
  const node = gql`
    mutation deleteGitlab($token: String!, $id: Int!) {
      deleteGitlab(token: $token, id: $id) {
        success
      }
    }
  `;

  const res = await Provider.client.session.runner<{
    deleteGitlab: { success: boolean };
  }>("mutation", node, {
    ...queryArgs,
  });

  return res.data?.deleteGitlab;
};

export const updateGitlab = async (queryArgs: {
  id: number;
  active?: boolean;
  description?: string;
  enterprisePageSlug?: string;
  gitlabToken?: string;
  name?: string;
  privilegesMode?: string;
  url?: string;
}) => {
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

  const res = await Provider.client.session.runner<{
    updateGitlab: { gitlab: { id: number } };
  }>("mutation", node, {
    ...queryArgs,
  });

  return res.data?.updateGitlab.gitlab;
};

export const getGitlabs = async () => {
  const node = gql`
    query getGitlabs($token: String!) {
      gitlabs(token: $token) {
        id
        name
        description
        url
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

  const res = await Provider.client.session.runner<{ gitlabs: [] }>(
    "query",
    node,
    {}
  );

  return res.data?.gitlabs;
};

//> Pipelines
export const addPipeline = async (queryArgs: {
  enterprisePageSlug: string;
  active: boolean;
  name: string;
  description: string;
}) => {
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
  const res = await Provider.client.session.runner<{
    addPipeline: { pipeline: { id: string } };
  }>("mutation", node, {
    ...queryArgs,
  });

  return res.data?.addPipeline.pipeline;
};

export const deletePipeline = async (queryArgs: { id: string }) => {
  const node = gql`
    mutation deletePipeline($token: String!, $id: String!) {
      deletePipeline(token: $token, id: $id) {
        success
      }
    }
  `;

  const res = await Provider.client.session.runner<{
    deletePipeline: { success: boolean };
  }>("mutation", node, {
    ...queryArgs,
  });

  return res.data?.deletePipeline;
};

export const updatePipeline = async (queryArgs: {
  id: number;
  active?: boolean;
  description?: string;
  enterprisePageSlug?: string;
  name?: string;
}) => {
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

  const res = await Provider.client.session.runner<{
    updatePipeline: { pipeline: { id: string } };
  }>("mutation", node, {
    ...queryArgs,
  });

  return res.data?.updatePipeline.pipeline;
};

export const getPipelines = async () => {
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

  const res = await Provider.client.session.runner<{ pipelines: [] }>(
    "query",
    node,
    {}
  );

  return res.data?.pipelines;
};

//> Connectors
export const addConnector = async (queryArgs: {
  active: boolean;
  url: string;
  name: string;
  description: string;
  connectorToken: string;
  enterprisePageSlug: string;
  privilegesMode: string;
  settings: {};
  shareMode: string;
}) => {
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

  const res = await Provider.client.session.runner<{
    addConnector: { connector: { id: string } };
  }>("mutation", node, {
    ...queryArgs,
  });

  return res.data?.addConnector.connector;
};

export const deleteConnector = async (queryArgs: { id: number }) => {
  const node = gql`
    mutation deleteConnector($token: String!, $id: Int!) {
      deleteConnector(token: $token, id: $id) {
        success
      }
    }
  `;

  const res = await Provider.client.session.runner<{
    deleteConnector: { success: boolean };
  }>("mutation", node, {
    ...queryArgs,
  });

  return res.data?.deleteConnector;
};

export const updateConnector = async (queryArgs: {
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
}) => {
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

  const res = await Provider.client.session.runner<{
    updateConnector: { connector: { id: number } };
  }>("mutation", node, {
    ...queryArgs,
  });

  return res.data?.updateConnector.connector;
};

export const getConnectors = async () => {
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
        isHashed
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

  const res = await Provider.client.session.runner<{ connectors: [] }>(
    "query",
    node,
    {}
  );

  return res.data?.connectors;
};

export const publishEnterprisePageViaConnector = async (queryArgs: {
  connectorId: number;
}) => {
  const node = gql`
    mutation publishToEnterpriseConnector($token: String!, $connectorId: Int!) {
      publishCompanyPage(token: $token, connectorId: $connectorId) {
        success
      }
    }
  `;

  const res = await Provider.client.session.runner<{
    publishCompanyPage: { success: boolean };
  }>("mutation", node, {
    ...queryArgs,
  });

  return res.data?.publishCompanyPage.success;
};
