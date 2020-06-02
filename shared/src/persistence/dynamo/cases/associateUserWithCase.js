const client = require('../../dynamodbClientService');

exports.associateUserWithCase = async ({
  applicationContext,
  caseId,
  userId,
}) => {
  // TODO: UserCase mapping entity?
  const {
    caseCaption,
    createdAt,
    docketNumber,
    docketNumberWithSuffix,
    leadCaseId,
    status,
  } = await applicationContext.getPersistenceGateway().getCaseByCaseId({
    applicationContext,
    caseId,
  });

  return client.put({
    Item: {
      caseCaption,
      caseId,
      createdAt,
      docketNumber,
      docketNumberWithSuffix,
      leadCaseId,
      pk: `user|${userId}`,
      sk: `case|${caseId}`,
      status,
    },
    applicationContext,
  });
};
