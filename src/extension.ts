'use strict';

import * as vscode from 'vscode';
import { GitProviderFileSystem } from './fileSystemProvider';

const URI_SCHEME = 'GPFS';

export function activate(context: vscode.ExtensionContext) {
  const Fs = new GitProviderFileSystem();
  context.subscriptions.push(
    vscode.workspace.registerFileSystemProvider(URI_SCHEME, Fs, {
      isCaseSensitive: true,
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('GPFS.workspaceInit', initWorkspace)
  );
}

function initWorkspace() {
  return vscode.workspace.updateWorkspaceFolders(0, 0, {
    uri: vscode.Uri.parse(`${URI_SCHEME}:/`),
    name: 'GitProviderFileSystem',
  });
}
