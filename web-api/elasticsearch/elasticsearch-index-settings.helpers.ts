import { Client } from '@opensearch-project/opensearch';
import { baseAliases } from './elasticsearch-aliases';
import { elasticsearchIndexes } from './elasticsearch-indexes';
import { elasticsearchMappings } from './elasticsearch-mappings';
import { esSettingsType } from './elasticsearch-settings';
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
  const esSettings: esSettingsType = settings({
    environment: environmentName,
    overriddenNumberOfReplicasIfNonProd,
  });

  await Promise.all(
    elasticsearchIndexes.map(async (index: string) => {
      try {
        const { body: indexExists } = await client.indices.exists({
          index,
        });

        if (!indexExists) {
          await client.indices.create({
            body: {
              mappings: {
                dynamic: false,
                ...elasticsearchMappings[index],
              },
              settings: esSettings,
            },
            index,
          });
        } else {
          client.indices.putSettings({
            body: {
              index: {
                max_result_window: esSettings.index.max_result_window,
                number_of_replicas: esSettings.index.number_of_replicas,
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
  const indices: string[] =
    (await client.cat.indices({ format: 'json' })).body
      ?.filter((i: { index: string }) => {
        return i.index.includes('efcms');
      })
      .map((i: { index: string }) => i.index) || [];
  const aliasedIndices: string[] =
    (await client.cat.aliases({ format: 'json' })).body
      ?.filter((a: { alias: string; index: string }) => {
        return baseAliases
          .map((ba: { alias: string; index: string }) => ba.alias)
          .includes(a.alias);
      })
      .map((a: { alias: string; index: string }) => a.index) || [];
  const unaliasedIndices =
    indices.filter(index => {
      return !aliasedIndices.includes(index);
    }) || [];
  if (unaliasedIndices.length) {
    client.indices.delete({
      index:
        unaliasedIndices.length === 1 ? unaliasedIndices[0] : unaliasedIndices,
    });
  }
};
