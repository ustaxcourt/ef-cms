// eslint-disable-next-line spellcheck/spell-checker
/*
considerations:
  possibly customize the stop-word list to exclude words like "tax", "court", "irs"?
  utilize word-stemming so that a search for "beginning" stems to "begin" which would match "begins", "beginner", "began" etc?
  special tokenizer that can identify and match exact docket numbers so that "193-22" is treated as a single searchable token?
*/
module.exports = {
  index: {
    analysis: {
      analyzer: {
        ustc_analyzer: {
          default: {
            type: 'simple',
          },
          default_search: {
            type: 'stop', // https://www.elastic.co/guide/en/elasticsearch/reference/current/analysis-stop-analyzer.html
          },
          filter: ['lowercase', 'asciifolding', 'english', 'ustc_stop'],
          tokenizer: 'standard',
        },
      },
      filter: {
        english: { stopwords: '_english_', type: 'stop' },
        ustc_stop: {
          stopwords: [
            'tax',
            'court',
            'alwaysskipthisword',
            'alwaysskipthistoo',
          ],
          type: 'stop',
        },
      },
      // tokenizer: {
      //   default: 'standard',
      // },
    },
    'mapping.total_fields.limit': '4000',
    number_of_replicas: 1,
    number_of_shards: 5,
  },
};
