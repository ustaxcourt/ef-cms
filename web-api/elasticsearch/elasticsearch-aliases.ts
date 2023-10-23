import { Client } from '@opensearch-project/opensearch';
import { elasticsearchIndexes } from './elasticsearch-indexes';
import { getClient } from './client';
import { requireEnvVars } from '../../shared/admin-tools/util';

export const getBaseAliasFromIndexName = (indexName: string): string => {
  if (!indexName.includes('-')) {
    return indexName;
  }
  const indexParts = indexName.split('-');
  indexParts.pop(); // remove the md5sum to get the base alias name
  return indexParts.join('-');
};

export const baseAliases: { alias: string; index: string }[] =
  elasticsearchIndexes.map(index => {
    const baseAlias = getBaseAliasFromIndexName(index);
    return { alias: baseAlias, index };
  });

export const getIndexNameFromAlias = (alias: string): string | undefined => {
  return baseAliases.find(a => a.alias === alias)?.index || undefined;
};

export const getElasticsearchAliases = async ({
  client,
}: {
  client?: Client;
}): Promise<
  {
    alias: string;
    index: string;
  }[]
> => {
  if (!client) {
    requireEnvVars(['ENV', 'ELASTICSEARCH_ENDPOINT']);
    const elasticsearchEndpoint = process.env.ELASTICSEARCH_ENDPOINT!;
    const environmentName = process.env.ENV!;
    client = await getClient({
      elasticsearchEndpoint,
      environmentName,
    });
  }

  let aliases: { alias: string; index: string }[];
  const existingAliases = (
    await client.cat.aliases({ format: 'json' })
  ).body?.filter((a: { alias: string; index: string }) => {
    return a.alias !== '.kibana';
  });
  if (!existingAliases.length) {
    aliases = elasticsearchIndexes.map(index => {
      const alias = getBaseAliasFromIndexName(index);
      return { alias, index: alias };
    });
  } else {
    aliases = existingAliases.map((a: { alias: string; index: string }) => {
      return { alias: a.alias, index: a.index };
    });
  }
  return aliases;
};
