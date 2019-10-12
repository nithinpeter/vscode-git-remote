import * as vscode from 'vscode';
import fetch from 'node-fetch';

import { DataProvider, Item } from './types';
import { URI_SCHEME } from '../costants';
import { getApiBaseUrl, stripSlash } from '../utils';

type GithubItem = {
  path: string;
  type: 'dir' | 'file';
  download_url: string;
};

export class GitHubProvider implements DataProvider {
  constructor(private repoUrl: string) {}
  public async getItemsInPath(path: string): Promise<Item[]> {
    const apiUrl = `${getApiBaseUrl(this.repoUrl)}/contents/${stripSlash(
      path
    )}`;
    const res = await fetch(apiUrl);
    if (!res.ok) {
      const errorMessge = await res.text();
      throw new Error(errorMessge);
    }
    const data: GithubItem[] = await res.json();

    return data.map(item => {
      if (item.path.startsWith('./')) {
        item.path = item.path.split('./')[1];
      }
      const uri = vscode.Uri.parse(`${URI_SCHEME}:/${item.path}`);
      if (item.type === 'dir') {
        return { uri, type: vscode.FileType.Directory };
      } else {
        var buf = Buffer.from('');
        const content = new Uint8Array(buf);
        return {
          uri,
          content,
          type: vscode.FileType.File,
          downloadUrl: item.download_url,
        };
      }
    });
  }
  public async getFileContent(fileDownloadUrl: string): Promise<Uint8Array> {
    const res = await fetch(fileDownloadUrl);
    const text = await res.text();
    var buf = Buffer.from(text);
    const content = new Uint8Array(buf);
    return content;
  }
}
