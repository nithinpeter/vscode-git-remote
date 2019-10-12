import * as Url from 'url-parse';

import { DataProvider, DataProviderKind } from './types';
import { GitHubProvider } from './github-provider';

class DataProviderFactory {
  private static instances: { [repoUrl: string]: DataProvider } = {};

  public provider(repoUrl: string) {
    if (!DataProviderFactory.instances[repoUrl]) {
      DataProviderFactory.instances[repoUrl] = this.createInstance(repoUrl);
    }
    return DataProviderFactory.instances[repoUrl];
  }

  private createInstance(repoUrl: string) {
    const kind: DataProviderKind = this.findProviderKind(repoUrl);

    switch (kind) {
      case DataProviderKind.Github:
        return new GitHubProvider(repoUrl);
      case DataProviderKind.Bitbucket:
      case DataProviderKind.Gitlab:
      case DataProviderKind.Unknown:
      default:
        throw new Error(`Data provider not implemented for: ${kind}`);
    }
  }

  private findProviderKind(repoUrl: string): DataProviderKind {
    const { hostname } = new Url(repoUrl);
    if (hostname.includes('github.com')) {
      return DataProviderKind.Github;
    } else if (hostname.includes('bitbucket.org')) {
      return DataProviderKind.Bitbucket;
    } else if (hostname.includes('gitlab.com')) {
      return DataProviderKind.Gitlab;
    }
    return DataProviderKind.Unknown;
  }
}

export const factory = new DataProviderFactory();
