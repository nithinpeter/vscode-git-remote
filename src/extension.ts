import * as vscode from 'vscode';
import { GitProviderFileSystem } from './fs-provider/fs-provider';
import { URI_SCHEME } from './costants';
import {
  getFsBasePathFromRepoUrl,
  getWorkspaceFolderLabel,
  getWsFolder,
  validateRepoUrl,
} from './utils';

export function activate(context: vscode.ExtensionContext) {
  const fs = new GitProviderFileSystem(context);
  context.subscriptions.push(
    vscode.workspace.registerFileSystemProvider(URI_SCHEME, fs, {
      isCaseSensitive: true,
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('GPFS.workspaceInit', () => init(context))
  );
}

function init(context: vscode.ExtensionContext) {
  vscode.window
    .showInputBox({
      prompt: 'Enter the git repo URL',
      ignoreFocusOut: true,
      placeHolder: `E.g. https://github.com/microsoft/vscode (followed by an optional @branch, @tag or @hash)`,
    })
    .then(repoUrl => {
      if (!validateRepoUrl(repoUrl)) {
        vscode.window.showErrorMessage(
          'Please enter a valid URL, e.g. https://github.com/microsoft/vscode@master'
        );
        return;
      }

      initWorkspace(repoUrl!);
    });
}

const initWorkspace = (repoUrl: string) => {
  // I could only make one WS foler open at a time with URI_SCHEME == 'GPFS :(
  // @ts-ignore
  const wsIndex = (getWsFolder() || {}).index;
  const hasWsAlready = typeof wsIndex === 'number';
  const insertIndex = hasWsAlready ? wsIndex : 0;
  const deleteCount = hasWsAlready ? 1 : 0;

  vscode.workspace.updateWorkspaceFolders(insertIndex!, deleteCount, {
    uri: vscode.Uri.parse(
      `${URI_SCHEME}://${getFsBasePathFromRepoUrl(repoUrl)}/`
    ),
    name: getWorkspaceFolderLabel(repoUrl),
  });
};
