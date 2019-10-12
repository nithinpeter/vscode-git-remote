import * as Url from 'url-parse';

export const getApiBaseUrl = (repoUrl: string) => {
  const p = new Url(repoUrl);
  return `${p.protocol}//api.${stripSlash(p.hostname)}/repos/${stripSlash(
    p.pathname
  )}`;
};

export const stripSlash = (str: string) => {
  return str.replace(/^\//, '').replace(/\/$/, '');
};
