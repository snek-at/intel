//#region > Imports
//#PACKAGE "snek-client"
//## npm install "snek-client"@2.0.0
// Contains the clients for API calls to SNEK engines
import { SnekClient } from "snek-client";

//> Converters
import {
  /* Enterprise page */
  getEnterprisePages,
  getEnterprisePageGeneralContent,
  updateEnterprisePageGeneralContent,
  getEnterprisePageProjectsContent,
  getEnterprisePageUsersContent,
  /* Gitlab */
  addGitlab,
  deleteGitlab,
  updateGitlab,
  getGitlabs,
  /* Pipeline */
  addPipeline,
  deletePipeline,
  updatePipeline,
  getPipelines,
  /* Connector */
  addConnector,
  deleteConnector,
  updateConnector,
  getConnectors,
} from "./converter";
//#endregion

class Provider {
  public snekclient: SnekClient;

  constructor(opsUrl: string) {
    this.snekclient = new SnekClient(opsUrl);
  }

  /* Enterprise page */
  getEnterprisePages = () => getEnterprisePages(this.snekclient.session);
  getEnterprisePageGeneralContent = (queryArgs: any) =>
    getEnterprisePageGeneralContent(this.snekclient.session, { ...queryArgs });
  updateEnterprisePageGeneralContent = (queryArgs: any) =>
    updateEnterprisePageGeneralContent(this.snekclient.session, {
      ...queryArgs,
    });
  getEnterprisePageProjectsContent = (queryArgs: any) =>
    getEnterprisePageProjectsContent(this.snekclient.session, { ...queryArgs });
  getEnterprisePageUsersContent = (queryArgs: any) =>
    getEnterprisePageUsersContent(this.snekclient.session, { ...queryArgs });
  /* Gitlab */
  addGitlab = (queryArgs: any) =>
    addGitlab(this.snekclient.session, { ...queryArgs });
  deleteGitlab = (queryArgs: any) =>
    deleteGitlab(this.snekclient.session, { ...queryArgs });
  updateGitlab = (queryArgs: any) =>
    updateGitlab(this.snekclient.session, { ...queryArgs });
  getGitlabs = () => getGitlabs(this.snekclient.session);
  /* Pipeline */
  addPipeline = (queryArgs: any) =>
    addPipeline(this.snekclient.session, { ...queryArgs });
  deletePipeline = (queryArgs: any) =>
    deletePipeline(this.snekclient.session, { ...queryArgs });
  updatePipeline = (queryArgs: any) =>
    updatePipeline(this.snekclient.session, { ...queryArgs });
  getPipelines = () => getPipelines(this.snekclient.session);
  /* Connector */
  addConnector = (queryArgs: any) =>
    addConnector(this.snekclient.session, { ...queryArgs });
  deleteConnector = (queryArgs: any) =>
    deleteConnector(this.snekclient.session, { ...queryArgs });
  updateConnector = (queryArgs: any) =>
    updateConnector(this.snekclient.session, { ...queryArgs });
  getConnectors = () => getConnectors(this.snekclient.session);
}

export default Provider;
