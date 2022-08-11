const client = require('../../dynamodbClientService');
const {
  getCaseMetadataWithCounsel,
} = require('../cases/getCaseMetadataWithCounsel');
const { getCaseByDocketNumber } = require('../cases/getCaseByDocketNumber');
const { map } = require('lodash');

exports.getCalendaredCasesForTrialSession = async ({
  applicationContext,
  omitDocketEntries = false,
  trialSessionId,
}) => {
  const trialSession = await client.get({
    Key: {
      pk: `trial-session|${trialSessionId}`,
      sk: `trial-session|${trialSessionId}`,
    },
    applicationContext,
  });

  const { caseOrder } = trialSession;
  const docketNumbers = map(caseOrder, 'docketNumber');

  const method = omitDocketEntries
    ? getCaseMetadataWithCounsel
    : getCaseByDocketNumber;

  const casesByDocketNumber = await Promise.all(
    docketNumbers.map(docketNumber =>
      method({
        applicationContext,
        docketNumber,
      }),
    ),
  );

  return caseOrder.map(order => {
    return {
      ...order,
      ...casesByDocketNumber.find(
        aCase => aCase.docketNumber === order.docketNumber,
      ),
    };
  });
};
