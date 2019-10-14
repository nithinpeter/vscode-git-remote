import * as Url from 'url-parse';
import * as vscode from 'vscode';

import { DataProviderKind, URI_SCHEME } from './costants';

export const getApiBaseUrl = (repoUrl: string) => {
  const p = new Url(repoUrl);
  return `${p.protocol}//api.${stripSlash(p.hostname)}/repos/${stripSlash(
    p.pathname
  )}`;
};

export const getRefQuery = (repoUrl: string) => {
  const p = new Url(repoUrl);
  const refQuery = String(p.query || '');

  return `${refQuery}`;
};

export const stripSlash = (str: string) => {
  // strip leading and trailing slashes
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
  let [repoPath, ref] = pathname.split('@');

  // vscode does not like `/` in the base path for some reason
  const friendlyRepoPath = stripSlash(repoPath).replace('/', ':');
  const friendlyRef = stripSlash(ref || '').replace('/', ':');

  // example: GITHUB@vscode:microsoft#master
  return (
    `${getProviderKindFromRepoUrl(repoUrl)}@${friendlyRepoPath}` +
    (friendlyRef ? `:${friendlyRef}` : '')
  );
};

export const getRepoUrlFromFsBasePath = (fsBasePath: string) => {
  let [kind, pathName] = fsBasePath.split('@');

  const [owner, repo, ref] = pathName.split(':');
  const refQuery = ref ? `?ref=${ref}` : '';

  if (kind === DataProviderKind.Github) {
    return `https://github.com/${owner}/${repo}${refQuery}`;
  } else if (kind === DataProviderKind.Bitbucket) {
    return `https://bitbucket.com/${owner}/${repo}${refQuery}`;
  } else if (kind === DataProviderKind.Gitlab) {
    return `https://gitlab.com/${owner}/${repo}${refQuery}`;
  }
};

export const getWorkspaceFolderLabel = (repoUrl: string) => {
  const { pathname } = new Url(repoUrl);

  // example: github://vscode/microsoft@master
  const kind = getProviderKindFromRepoUrl(repoUrl).toLowerCase();
  return `${kind}://${pathname}`;
};

export const validateRepoUrl = (repoUrl: string = '') => {
  const regex = /https:\/\/github.com\/[A-Za-z0-9_.\-~]+\/[A-Za-z0-9_.\-~]+/;
  return regex.test(repoUrl);
};

export const getWsFolder = (): vscode.WorkspaceFolder | undefined => {
  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (workspaceFolders) {
    const ws = workspaceFolders.find(wsf => wsf.uri.scheme === URI_SCHEME);
    return ws;
  }
};
