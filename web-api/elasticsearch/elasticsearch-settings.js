// eslint-disable-next-line spellcheck/spell-checker
/*
considerations:
  possibly customize the stop-word list to exclude words like "tax", "court", "irs"?

  test 'asciifolding' by putting the following into an Order contents: Déjà vu
  then search for "deja" to see if the order is returned.
*/
module.exports = {
  settings: {
    index: {
      analysis: {
        analyzer: {
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
      number_of_replicas: 1,
      number_of_shards: 10,
    },
  },
};
