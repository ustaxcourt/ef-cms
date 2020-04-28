const { createISODateString } = require('../utilities/DateHandler');

const checkSearchClientMappings = async ({ applicationContext, index }) => {
  /**
   * recursively searches the provided object for the provided key
   * and returns the count of instances of that key
   *
   * @param {object} object the object to search
   * @param {string} key the key to search for
   * @returns {number} the total number of key matches
   */
  function countValues(object, key) {
    let count = 0;
    Object.keys(object).forEach(k => {
      if (k === key) {
        count++;
      }
      if (object[k] && typeof object[k] === 'object') {
        const countToAdd = countValues(object[k], key);
        count = count + countToAdd;
      }
    });
    return count;
  }

  const fields = await applicationContext
    .getPersistenceGateway()
    .getIndexMappingFields({
      applicationContext,
      index,
    });

  const mappingLimit = await applicationContext
    .getPersistenceGateway()
    .getIndexMappingLimit({
      applicationContext,
      index,
    });

  let totalTypes = 0;
  let fieldText = '';

  for (let field of Object.keys(fields)) {
    const typeMatches = countValues(fields[field], 'type');

    if (typeMatches > 50) {
      fieldText += `${field}: ${typeMatches}, `;
    }
    totalTypes += typeMatches;
  }

  const sendToHoneybadger = msg => {
    const honeybadger = applicationContext.initHoneybadger();

    if (honeybadger) {
      honeybadger.notify(msg);
    } else {
      console.log(msg);
    }
  };

  if (fieldText !== '') {
    sendToHoneybadger(
      `Warning: Search Client creating greater than 50 indexes for ${index} on the following fields: ${fieldText.substring(
        0,
        fieldText.length - 2,
      )}`,
    );
  }

  const currentPercent = (totalTypes / mappingLimit) * 100;
  if (currentPercent >= 75) {
    sendToHoneybadger(
      `Warning: Search Client Mappings have reached the 75% threshold for ${index} - currently ${currentPercent}%`,
    );
  } else if (currentPercent >= 50) {
    sendToHoneybadger(
      `Warning: Search Client Mappings have reached the 50% threshold for ${index} - currently ${currentPercent}%`,
    );
  }
};

/**
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @returns {object} the results of all the index calls for logging
 */
exports.reprocessFailedRecordsInteractor = async ({ applicationContext }) => {
  applicationContext.logger.info('Time', createISODateString());
  const honeybadger = applicationContext.initHoneybadger();

  // Check mapping counts
  const elasticsearchIndexes = applicationContext.getElasticsearchIndexes();
  await Promise.all(
    elasticsearchIndexes.map(index =>
      checkSearchClientMappings({ applicationContext, index }),
    ),
  );

  const recordsToProcess = await applicationContext
    .getPersistenceGateway()
    .getElasticsearchReindexRecords({ applicationContext });

  if (recordsToProcess.length) {
    for (const record of recordsToProcess) {
      try {
        let fullRecord;

        if (record.recordPk.includes('case|')) {
          const fullCase = await applicationContext
            .getPersistenceGateway()
            .getCaseByCaseId({
              applicationContext,
              caseId: record.recordPk.split('|')[1],
            });

          if (fullCase.caseId) {
            fullRecord = fullCase;
            record.recordSk = record.recordPk;
          } else {
            fullRecord = await applicationContext
              .getPersistenceGateway()
              .getRecord({
                applicationContext,
                recordPk: record.recordPk,
                recordSk: record.recordSk,
              });
          }
        } else {
          fullRecord = await applicationContext
            .getPersistenceGateway()
            .getRecord({
              applicationContext,
              recordPk: record.recordPk,
              recordSk: record.recordSk,
            });
        }

        await applicationContext.getPersistenceGateway().indexRecord({
          applicationContext,
          fullRecord,
          record,
        });

        await applicationContext
          .getPersistenceGateway()
          .deleteElasticsearchReindexRecord({
            applicationContext,
            recordPk: record.recordPk,
            recordSk: record.recordSk,
          });
      } catch (e) {
        applicationContext.logger.info('Error', e);
        honeybadger && honeybadger.notify(e);
      }
    }

    applicationContext.logger.info('Time', createISODateString());
  }
};
