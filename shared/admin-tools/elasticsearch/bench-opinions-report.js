const { getClient } = require('../../../web-api/elasticsearch/client');

const environmentName = process.argv[2] || 'exp1';

// eslint-disable-next-line @miovision/disallow-date/no-new-date
const d = new Date();
const year = process.argv[3] || d.getFullYear();
let nextYear = year;
const month = (process.argv[4] || d.getMonth() + 1 + '').padStart(2, '0');
let nextMonth = (parseInt(month) + 1) % 12;
if (nextMonth === 1) {
  nextYear++;
}
nextMonth = (nextMonth + '').padStart(2, '0');

console.log(
  `--- generating report for ${month}, ${year} through ${nextMonth}, ${nextYear} ---`,
);

const findBenchOpinions = async (start, end) => {
  const esClient = await getClient({ environmentName });
  const query = {
    body: {
      _source: ['pk.S', 'sk.S'],
      query: {
        bool: {
          must: [
            {
              match: {
                'eventCode.S': 'OST',
              },
            },
            {
              range: {
                'filingDate.S': {
                  gte: start,
                  lte: end,
                },
              },
            },
          ],
        },
      },
    },
    index: 'efcms-docket-entry',
    size: 10000,
  };
  const results = await esClient.search(query);
  if (results.length >= 10000) {
    throw 'too many results';
  }

  return results.hits.hits.map(hit => hit['_source'].pk.S.split('|')[1]);
};

(async () => {
  const docketNumbers = await findBenchOpinions(
    `${year}-${month}-01T04:00:00Z`,
    `${nextYear}-${nextMonth}-01T04:00:00Z`,
  );
  docketNumbers.forEach(num => console.log(num));
  // console.log(docketNumbers);
})();
