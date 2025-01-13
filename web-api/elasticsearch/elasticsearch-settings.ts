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

/*
It looks like we have two analyzers. ustc_analyzer, english_exact. ustc_analyzer is unused. english_exact is using something very close to the standard analyzer. The only extra thing standard does is remove punctuation with stop filter.

english_exact is specified in the docket-entry-mappings, meaning that when the documents are indexed they use this analyzer.

filters remove words from analysis. So common words to remove are "if" "the" "is".

For filters there are 4 specified. english, filter_shingle, filter_stemmer, ustc_stop. None of these filters are specified in a mapping, or analyzer.filter which means they are likely unused.

Links: 
Search Analyzer: https://opensearch.org/docs/latest/analyzers/search-analyzers/
Index Analyzer: https://opensearch.org/docs/latest/analyzers/index-analyzers/
Standard Analyzer: https://opensearch.org/docs/latest/analyzers/supported-analyzers/standard/
*/
