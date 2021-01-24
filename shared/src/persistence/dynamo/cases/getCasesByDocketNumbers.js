const { getCaseByDocketNumber } = require('./getCaseByDocketNumber');

/**
 * getCasesByDocketNumbers
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Array} providers.docketNumbers the docket numbers to get
 * @returns {Array} the case details
 */
exports.getCasesByDocketNumbers = async ({
  applicationContext,
  docketNumbers,
}) => {
  return await Promise.all(
    docketNumbers.map(docketNumber =>
      getCaseByDocketNumber({ applicationContext, docketNumber }),
    ),
  );
};
