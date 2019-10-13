import { DataProvider } from './types';
import { GitHubProvider } from './github-provider';
import { getProviderKindFromRepoUrl, getRepoUrlFromFsBasePath } from '../utils';
import { DataProviderKind } from '../costants';

class DataProviderFactory {
  private instances: { [fsBasePath: string]: DataProvider } = {};

  public provider(fsBasePath: string) {
    if (!this.instances[fsBasePath]) {
      this.instances[fsBasePath] = this.createInstance(
        fsBasePath
      );
    }
    return this.instances[fsBasePath];
  }

  private createInstance(fsBasePath: string) {
    const repoUrl = getRepoUrlFromFsBasePath(fsBasePath);
    const kind: DataProviderKind = getProviderKindFromRepoUrl(repoUrl!);

    switch (kind) {
      case DataProviderKind.Github:
        return new GitHubProvider(fsBasePath);
      case DataProviderKind.Bitbucket:
      case DataProviderKind.Gitlab:
      case DataProviderKind.Unknown:
      default:
        throw new Error(`Data provider not implemented for: ${kind}`);
    }
  }
}

export const factory = new DataProviderFactory();
