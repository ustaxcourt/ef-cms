const applicationContext = require('./src/applicationContext')();
const client = require('../shared/src/persistence/dynamodbClientService');

module.exports = {
  deleteCase,
};

async function deleteCase(context, events, done) {
  const caseId = context.vars.caseId;

  const caseRecords = await client.query({
    ExpressionAttributeNames: {
      '#pk': 'pk',
    },
    ExpressionAttributeValues: {
      ':pk': `${caseId}`,
    },
    KeyConditionExpression: '#pk = :pk',
    applicationContext,
  });

  for (let caseRecord of caseRecords) {
    await client.delete({
      applicationContext,
      key: {
        pk: caseRecord.pk,
        sk: caseRecord.sk,
      },
    });
  }

  let workItems = [];
  caseRecords[0].documents.forEach(
    document => (workItems = [...workItems, ...(document.workItems || [])]),
  );

  for (let workItem of workItems) {
    await client.delete({
      applicationContext,
      key: {
        pk: workItem.workItemId,
        sk: workItem.workItemId,
      },
    });

    await client.delete({
      applicationContext,
      key: {
        pk: 'petitions|workItem',
        sk: workItem.workItemId,
      },
    });
  }

  const petitionerDashboardRecords = await client.query({
    ExpressionAttributeNames: {
      '#pk': 'pk',
      '#sk': 'sk',
    },
    ExpressionAttributeValues: {
      ':pk': '26b07814-378a-4ebe-9152-b1d6a53bef32|case',
      ':sk': caseRecords[0].caseId,
    },
    KeyConditionExpression: '#pk = :pk AND #sk = :sk',
    applicationContext,
  });

  for (let petitionerDashboardRecord of petitionerDashboardRecords) {
    await client.delete({
      applicationContext,
      key: {
        pk: petitionerDashboardRecord.pk,
        sk: petitionerDashboardRecord.sk,
      },
    });
  }

  await client.delete({
    applicationContext,
    key: {
      pk: `${caseRecords[0].docketNumber}|case`,
      sk: caseId,
    },
  });

  return done();
}
