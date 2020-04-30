const AWS = require('aws-sdk');
const { get } = require('lodash');

exports.search = async ({ applicationContext, searchParameters }) => {
  const results = [];

  const body = await applicationContext
    .getSearchClient()
    .search(searchParameters);

  const hits = get(body, 'hits.hits');
  const total = get(body, 'hits.total.value');

  if (hits && hits.length > 0) {
    hits.forEach(hit => {
      results.push(AWS.DynamoDB.Converter.unmarshall(hit['_source']));
    });
  }

  return {
    results,
    total,
  };
};
