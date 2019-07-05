const {
  getRecordsViaMapping,
} = require('../../dynamo/helpers/getRecordsViaMapping');
const { stripInternalKeys } = require('../../dynamo/helpers/stripInternalKeys');

/**
 * getCaseDeadlinesByCaseId
 *
 * @param caseId
 * @param applicationContext
 * @returns {*}
 */
exports.getCaseDeadlinesByCaseId = ({ applicationContext, caseId }) => {
  return getRecordsViaMapping({
    applicationContext,
    key: caseId,
    type: 'case-deadline',
  }).then(stripInternalKeys);
};
