/*
considerations:
  possibly customize the stop-word list to exclude words like "tax", "court", "irs"?

  test 'asciifolding' by putting the following into an Order contents: Déjà vu
  then search for "deja" to see if the order is returned.
*/

export type esSettingsType = {
  index: {
    analysis: {
      analyzer: {
        english_exact: {
          filter: string[];
          tokenizer: string;
        };
        ustc_analyzer: {
          default: {
            type: string;
          };
          default_search: {
            type: string;
          };
          filter: string[];
          tokenizer: string;
        };
      };
      filter: {
        english: {
          stopwords: string;
          type: string;
        };
        filter_shingle: {
          max_shingle_size: number;
          min_shingle_size: number;
          output_unigrams: boolean;
          type: string;
        };
        filter_stemmer: {
          language: string;
          type: string;
        };
        ustc_stop: {
          stopwords: string[];
          type: string;
        };
      };
    };
    'mapping.total_fields.limit': string;
    max_result_window: number;
    number_of_replicas: number;
    number_of_shards: number;
  };
};

export const settings = ({
  environment,
  overriddenNumberOfReplicasIfNonProd,
}: {
  environment: string;
  overriddenNumberOfReplicasIfNonProd: number;
}): esSettingsType => {
  let actualNumberOfReplicas = 2;
  if (environment && environment !== 'prod') {
    actualNumberOfReplicas = overriddenNumberOfReplicasIfNonProd || 0;
  }

  console.log(
    'Configuring the index number_of_replicas to',
    actualNumberOfReplicas,
  );

  return {
    index: {
      analysis: {
        analyzer: {
          english_exact: {
            filter: ['lowercase'],
            tokenizer: 'standard',
          },
          ustc_analyzer: {
            default: {
              type: 'simple',
            },
            default_search: {
              type: 'stop',
            },
            filter: [
              'lowercase',
              'asciifolding',
              'english',
              'ustc_stop',
              'filter_stemmer',
              'filter_shingle',
            ],
            tokenizer: 'standard',
          },
        },
        filter: {
          english: { stopwords: '_english_', type: 'stop' },
          filter_shingle: {
            max_shingle_size: 3,
            min_shingle_size: 2,
            output_unigrams: true,
            type: 'shingle',
          },
          filter_stemmer: {
            language: '_english_',
            type: 'porter_stem',
          },
          ustc_stop: {
            stopwords: ['tax', 'court'],
            type: 'stop',
          },
        },
      },
      'mapping.total_fields.limit': '1000',
      max_result_window: 20000,
      number_of_replicas: actualNumberOfReplicas,
      number_of_shards: 1,
    },
  };
};
