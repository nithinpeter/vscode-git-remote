import * as vscode from 'vscode';

export type Item = {
  type: vscode.FileType;
  uri: vscode.Uri;
  downloadUrl?: string;
  content?: Uint8Array;
};

export interface DataProvider {
  getItemsInPath(path: string): Promise<Item[]>;
  getFileContent(fileDownloadUrl: string): Promise<Uint8Array>;
}
