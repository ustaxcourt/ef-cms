/*
considerations:
  possibly customize the stop-word list to exclude words like "tax", "court", "irs"?

  test 'asciifolding' by putting the following into an Order contents: Déjà vu
  then search for "deja" to see if the order is returned.
*/
import { IndexSettings } from '@opensearch-project/opensearch/api/_types/indices._common';

export const settings = ({
  environment,
  overriddenNumberOfReplicasIfNonProd,
}: {
  environment: string;
  overriddenNumberOfReplicasIfNonProd: number;
}): IndexSettings => {
  let actualNumberOfReplicas = 2;
  if (environment && environment !== 'prod') {
    actualNumberOfReplicas = overriddenNumberOfReplicasIfNonProd || 0;
  }

  console.log(
    'Configuring the index number_of_replicas to',
    actualNumberOfReplicas,
  );

  // When no analyzer is specified the standard analyzer is used. https://opensearch.org/docs/latest/analyzers/index-analyzers/
  return {
    index: {
      'mapping.total_fields.limit': '1000',
      max_result_window: 20000,
      number_of_replicas: actualNumberOfReplicas,
      number_of_shards: 1,
    },
  };
};
