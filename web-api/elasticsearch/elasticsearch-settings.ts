import { IndexSettings } from '@opensearch-project/opensearch/api/_types/indices._common';

export const settings = ({
  environment,
  overriddenNumberOfReplicasIfNonProd,
  overriddenNumberOfShardsIfNonProd,
}: {
  environment: string;
  overriddenNumberOfReplicasIfNonProd: number;
  overriddenNumberOfShardsIfNonProd: number;
}): IndexSettings => {
  const REPLICAS_DEFAULT_PROD = 2;
  const SHARDS_DEFAULT_PROD = 3;
  const REPLICAS_DEFAULT_LOWER = 0;
  const SHARDS_DEFAULT_LOWER = 1;

  let actualNumberOfReplicas = REPLICAS_DEFAULT_PROD;
  let actualNumberOfShards = SHARDS_DEFAULT_PROD;
  if (environment && environment !== 'prod') {
    actualNumberOfReplicas =
      overriddenNumberOfReplicasIfNonProd || REPLICAS_DEFAULT_LOWER;
    actualNumberOfShards =
      overriddenNumberOfShardsIfNonProd > 0
        ? overriddenNumberOfShardsIfNonProd
        : SHARDS_DEFAULT_LOWER;
  }

  console.log(`Configuring number_of_replicas to ${actualNumberOfReplicas}`);
  console.log(`Configuring number_of_shards to ${actualNumberOfShards}`);

  // When no analyzer is specified the standard analyzer is used. https://opensearch.org/docs/latest/analyzers/index-analyzers/
  return {
    index: {
      'mapping.total_fields.limit': '1000',
      max_result_window: 20000,
      number_of_replicas: actualNumberOfReplicas,
      number_of_shards: actualNumberOfShards,
    },
  };
};
