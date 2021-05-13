const { getClient } = require('../../../web-api/elasticsearch/client');

const environmentName = process.argv[2] || 'exp1';

const getOpenCases = async () => {
  const esClient = await getClient({ environmentName });

  const allOpenCases = [];
  const responseQueue = [];

  // start things off by searching, setting a scroll timeout, and pushing
  // our first response into the queue to be processed
  const response = await esClient.search({
    _source: ['docketNumber.S', 'caseCaption.S', 'sortableDocketNumber.N'],
    body: {
      query: {
        bool: {
          must_not: [
            {
              term: {
                'status.S': 'Closed',
              },
            },
          ],
        },
      },
    },
    index: 'efcms-case',
    scroll: '30s',
    size: 5000,
  });

  responseQueue.push(response);

  while (responseQueue.length) {
    const body = responseQueue.shift();

    // collect the titles from this response
    body.hits.hits.forEach(function (hit) {
      allOpenCases.push({
        caseCaption: hit['_source'].caseCaption.S,
        docketNumber: hit['_source'].docketNumber.S,
        sortableDocketNumber: parseInt(hit['_source'].sortableDocketNumber.N),
      });
    });

    // check to see if we have collected all of the quotes
    if (body.hits.total.value === allOpenCases.length) {
      return allOpenCases;
    }

    // get the next response if there are more quotes to fetch
    responseQueue.push(
      await esClient.scroll({
        scroll: '30s',
        scrollId: body['_scroll_id'],
      }),
    );
  }
};

(async () => {
  const openCases = await getOpenCases();

  openCases
    .filter(hit => hit.caseCaption.indexOf(' , Petitioner') > -1)
    .sort((a, b) => a.sortableDocketNumber - b.sortableDocketNumber)
    .forEach(openCase => {
      console.log(openCase.docketNumber);
    });
})();
