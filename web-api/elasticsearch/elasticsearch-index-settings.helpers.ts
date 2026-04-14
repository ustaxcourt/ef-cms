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
                // number_of_shards can not be changed on an extant index
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
  const aliasedAndProtectedIndices = [
    ...aliasedIndices,
    ...elasticsearchIndexes,
  ];

  console.log('All efcms indices on cluster:', JSON.stringify(indices));
  console.log('Aliased indices:', JSON.stringify(aliasedIndices));
  console.log(
    'Protected indices (from code):',
    JSON.stringify(elasticsearchIndexes),
  );

  const unaliasedIndices =
    indices.filter(index => {
      return !aliasedAndProtectedIndices.includes(index);
    }) || [];

  console.log('Unaliased indices to delete:', JSON.stringify(unaliasedIndices));

  // Safety check: never delete ALL efcms indices. If the unaliased list equals
  // the full index list, something has gone wrong (e.g. the domain was replaced
  // after an engine version upgrade and the indices have unexpected names).
  if (
    unaliasedIndices.length > 0 &&
    unaliasedIndices.length >= indices.length
  ) {
    console.log(
      'SAFETY CHECK: refusing to delete indices because ALL efcms indices ' +
        'would be removed. This likely indicates the cluster was replaced or ' +
        'the indices have unexpected names. Skipping deletion to preserve data.',
    );
    return;
  }

  if (unaliasedIndices.length) {
    try {
      await client.indices.delete({
        index: unaliasedIndices,
      });
      console.log('Successfully deleted unaliased indices.');
    } catch (err) {
      console.log(
        'We were unable to delete the unaliased indices; the next deployment should get this done',
      );
    }
  } else {
    console.log('No unaliased indices to delete.');
  }
};
