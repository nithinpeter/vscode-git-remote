import * as Url from 'url-parse';
import * as vscode from 'vscode';

import { DataProviderKind, URI_SCHEME } from './costants';

export const getApiBaseUrl = (repoUrl: string) => {
  const p = new Url(repoUrl);
  return `${p.protocol}//api.${stripSlash(p.hostname)}/repos/${stripSlash(
    p.pathname
  )}`;
};

export const stripSlash = (str: string) => {
  // strip leading and trainling slashes
  return str.replace(/^\//, '').replace(/\/$/, '');
};

export const getProviderKindFromRepoUrl = (
  repoUrl: string
): DataProviderKind => {
  const { hostname } = new Url(repoUrl);
  if (hostname.includes('github.com')) {
    return DataProviderKind.Github;
  } else if (hostname.includes('bitbucket.org')) {
    return DataProviderKind.Bitbucket;
  } else if (hostname.includes('gitlab.com')) {
    return DataProviderKind.Gitlab;
  }
  return DataProviderKind.Unknown;
};

export const getFsBasePathFromRepoUrl = (repoUrl: string): string => {
  const { pathname } = new Url(repoUrl);
  // vscode does not like `/` in the base path for some reason
  const friendlyPathName = stripSlash(pathname).replace('/', ':');

  // example: GITHUB@vscode:microsoft
  return `${getProviderKindFromRepoUrl(repoUrl)}@${friendlyPathName}`;
};

export const getRepoUrlFromFsBasePath = (fsBasePath: string) => {
  let [kind, repoPath] = fsBasePath.split('@');
  repoPath = repoPath.replace(':', '/');

  if (kind === DataProviderKind.Github) {
    return `https://github.com/${repoPath}`;
  } else if (kind === DataProviderKind.Bitbucket) {
    return `https://github.com/${repoPath}`;
  } else if (kind === DataProviderKind.Gitlab) {
    return `https://gitlab.com/${repoPath}`;
  }
};

export const getWsFolder = (): vscode.WorkspaceFolder | undefined => {
  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (workspaceFolders) {
    const ws = workspaceFolders.find(wsf => wsf.uri.scheme === URI_SCHEME);
    return ws;
  }
};
