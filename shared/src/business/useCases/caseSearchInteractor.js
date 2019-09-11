/**
 * caseSearchInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.countryType the country type to search cases by (domestic/international)
 * @param {string} providers.petitionerName the name of the petitioner to search cases by
 * @param {string} providers.petitionerState the state of the petitioner to search cases by
 * @param {string} providers.yearFiledMax the max year filed to search cases by
 * @param {string} providers.yearFiledMin the min year filed to search cases by
 * @returns {object} the case data
 */
exports.caseSearchInteractor = async ({
  applicationContext,
  countryType,
  petitionerName,
  petitionerState,
  yearFiledMax,
  yearFiledMin,
}) => {
  //delete full index
  /*await applicationContext.getSearchClient().indices.delete(
    {
      index: 'cases',
    },
    function(err) {
      if (err) {
        console.error(err.message);
      } else {
        console.log('Index has been deleted!');
      }
    },
  );*/

  //set up the index
  /*const caseCatalog = await applicationContext
    .getPersistenceGateway()
    .getAllCatalogCases({
      applicationContext,
    });

  for (let caseRecord of caseCatalog) {
    console.log('indexing');
    await applicationContext.getSearchClient().index({
      body: {
        ...caseRecord,
      },
      id: caseRecord.caseId,
      index: 'cases',
    });
  }*/

  const query = [];

  if (petitionerName) {
    query.push({
      bool: {
        should: [
          { match: { 'contactPrimary.name': petitionerName } },
          { match: { 'contactSecondary.name': petitionerName } },
        ],
      },
    });
  }
  if (countryType) {
    query.push({
      bool: {
        should: [
          { match: { 'contactPrimary.countryType': countryType } },
          { match: { 'contactSecondary.countryType': countryType } },
        ],
      },
    });
  }
  if (petitionerState) {
    query.push({
      bool: {
        should: [
          { match: { 'contactPrimary.state': petitionerState } },
          { match: { 'contactSecondary.state': petitionerState } },
        ],
      },
    });
  }
  if (yearFiledMin || yearFiledMax) {
    query.push({
      range: {
        yearFiled: {
          boost: 2.0,
          gte: yearFiledMin,
          lte: yearFiledMax,
        },
      },
    });
  }

  console.log(JSON.stringify(query));

  const { body } = await applicationContext.getSearchClient().search({
    body: {
      query: {
        bool: {
          must: query,
        },
      },
    },
    index: 'cases',
  });

  const foundCases = [];
  if (body && body.hits) {
    for (let hit of body.hits.hits) {
      foundCases.push(hit['_source']);
    }
  }

  return foundCases;
};
