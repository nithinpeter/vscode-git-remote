import * as vscode from 'vscode';
import { GitProviderFileSystem } from './fs-provider/fs-provider';
import { URI_SCHEME } from './costants';

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
    })
    .then(repoUrl => {
      context.workspaceState.update('repoUrl', repoUrl);
      initWorkspace(repoUrl!);
    });
}

const initWorkspace = (repoUrl: string) => {
  const workspaceFolders = vscode.workspace.workspaceFolders;

  if (workspaceFolders) {
    const wsFolder = workspaceFolders.find(wsf => {
      return wsf.uri.scheme === URI_SCHEME;
    });
    const wsFolderIndex = wsFolder ? wsFolder.index : undefined;

    vscode.workspace.updateWorkspaceFolders(
      typeof wsFolderIndex === 'number' ? wsFolderIndex : 0,
      typeof wsFolderIndex === 'number' ? 1 : 0,
      {
        uri: vscode.Uri.parse(`${URI_SCHEME}:/`),
        name: repoUrl,
      }
    );
  }

  vscode.workspace.updateWorkspaceFolders(0, 0, {
    uri: vscode.Uri.parse(`${URI_SCHEME}:/`),
    name: repoUrl,
  });
};
