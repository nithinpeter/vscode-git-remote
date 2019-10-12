import * as vscode from 'vscode';

export type Item = {
  type: vscode.FileType;
  uri: vscode.Uri;
  downloadUrl?: string;
  content?: Uint8Array;
};

export enum DataProviderKind {
  Github = 'GITHUB',
  Bitbucket = 'BITBUCKET',
  Gitlab = 'GITLAB',
  Unknown = 'UNKNOWN',
}

export interface DataProvider {
  getItemsInPath(path: string): Promise<Item[]>;
  getFileContent(fileDownloadUrl: string): Promise<Uint8Array>;
}
