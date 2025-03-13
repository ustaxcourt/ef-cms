import { Client } from '@opensearch-project/opensearch';
import { baseAliases } from './elasticsearch-aliases';
import { elasticsearchIndexes } from './elasticsearch-indexes';
import { elasticsearchMappings } from './elasticsearch-mappings';
import { settings } from './elasticsearch-settings';

export const setupIndexes = async ({
  client,
  environmentName,
}: {
  client: Client;
  environmentName: string;
}): Promise<void> => {
  const overriddenNumberOfReplicasIfNonProd: number = Number(
    process.env.OVERRIDE_ES_NUMBER_OF_REPLICAS,
  );
  const overriddenNumberOfShardsIfNonProd: number = Number(
    process.env.OVERRIDE_ES_NUMBER_OF_SHARDS,
  );
  const esSettings = settings({
    environment: environmentName,
    overriddenNumberOfReplicasIfNonProd,
    overriddenNumberOfShardsIfNonProd,
  });

  await Promise.all(
    elasticsearchIndexes.map(async (index: string) => {
      try {
        const { body: indexExists } = await client.indices.exists({
          index,
        });

        if (!indexExists) {
          return client.indices.create({
            body: {
              mappings: {
                dynamic: 'false',
                ...elasticsearchMappings[index],
              },
              settings: esSettings,
            },
            index,
          });
        } else {
          return client.indices.putSettings({
            body: {
              index: {
                max_result_window: esSettings.index!.max_result_window,
                number_of_replicas: esSettings.index!.number_of_replicas,
              },
            },
            index,
          });
        }
      } catch (e) {
        console.log(
          'Error trying to create or update the OpenSearch indices: ',
          e,
        );
      }
    }),
  );
};

export const deleteUnaliasedIndices = async ({
  client,
}: {
  client: Client;
}): Promise<void> => {
  const indices: string[] = (await client.cat.indices({ format: 'json' })).body
    .map(i => i.index)
    .filter(i => typeof i === 'string')
    .filter(i => i.includes('efcms'));

  const aliasedIndices: string[] = (
    await client.cat.aliases({ format: 'json' })
  ).body
    .filter(a => typeof a.alias === 'string')
    .filter(a => {
      return baseAliases.map(ba => ba.alias).includes(a.alias!);
    })
    .map(a => a.index)
    .filter(i => typeof i === 'string');
  const unaliasedIndices =
    indices.filter(index => {
      return !aliasedIndices.includes(index);
    }) || [];
  if (unaliasedIndices.length) {
    try {
      await client.indices.delete({
        index: unaliasedIndices,
      });
    } catch (err) {
      console.log(
        'We were unable to delete the unaliased indices; the next deployment should get this done',
      );
    }
  }
};
