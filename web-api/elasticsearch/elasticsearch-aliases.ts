import { Client } from '@opensearch-project/opensearch';
import { elasticsearchIndexes } from './elasticsearch-indexes';
import { getClient } from './client';

export const getBaseAliasFromIndexName = (indexName: string): string => {
  const indexParts = indexName.split('-');
  indexParts.pop(); // remove the md5sum to get the base alias name
  return indexParts.join('-');
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
    const {
      ELASTICSEARCH_ENDPOINT: elasticsearchEndpoint,
      ENV: environmentName,
    } = process.env;
    client = await getClient({
      elasticsearchEndpoint,
      environmentName,
    });
  }

  let aliases: { alias: string; index: string }[] = [];
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
    aliases = existingAliases.map(
      (a: {
        alias: string;
        index: string;
        filter?: string;
        is_write_index?: string;
      }) => {
        return { alias: a.alias, index: a.index };
      },
    );
  }
  return aliases;
};
