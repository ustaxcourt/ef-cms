/**
 * due to a race condition, a document that had been served, was returned to the drafts folder. this resolves that.
 */

const createApplicationContext = require('../../../web-api/src/applicationContext');
const {
  aggregatePartiesForService,
} = require('../../src/business/utilities/aggregatePartiesForService');
const { Case } = require('../../src/business/entities/cases/Case');
const { DocketEntry } = require('../../src/business/entities/DocketEntry');
const { DynamoDB } = require('aws-sdk');
const { readFileSync } = require('fs');

if (process.argv.length < 5) {
  console.log('Please provide required parameters');
  console.log('');
  console.log(
    '$ node fix-race-condition-served-in-drafts.js <docketNumber> <docketEntryId> <timestamp> <pathToJsonRequest> [<performUpdate>]',
  );
  process.exit();
}

const docketNumber = process.argv[2];
const docketEntryId = process.argv[3];
const timestamp = process.argv[4];
const requestJsonFile = process.argv[5];
const performUpdate = process.argv[6];

const request = JSON.parse(readFileSync(requestJsonFile, 'utf-8'));

(async () => {
  const applicationContext = createApplicationContext({});
  const dynamo = new DynamoDB();

  const subjectCase = await applicationContext
    .getPersistenceGateway()
    .getCaseByDocketNumber({
      applicationContext,
      docketNumber,
    });
  const caseEntity = new Case(subjectCase, { applicationContext });

  const res = await dynamo
    .getItem({
      Key: {
        pk: {
          S: `case|${docketNumber}`,
        },
        sk: {
          S: `docket-entry|${docketEntryId}`,
        },
      },

      TableName: process.env.DYNAMODB_TABLE_NAME,
    })
    .promise();

  const servedParties = aggregatePartiesForService(caseEntity);

  const rawDocketEntry = DynamoDB.Converter.unmarshall(res.Item);

  console.log(rawDocketEntry);

  // might need to update number of page
  const numberOfPages = await applicationContext
    .getUseCaseHelpers()
    .countPagesInDocument({
      applicationContext,
      docketEntryId,
    });
  // set as served for all of the parties

  // set
  // - attachments: form.attachments
  rawDocketEntry.attachments = request.form.attachments;

  // - date: form.date
  rawDocketEntry.date = request.form.date;

  // - documentTitle: form.generatedDocumentTitle
  rawDocketEntry.documentTitle = request.form.generatedDocumentTitle;

  // - documentType
  rawDocketEntry.documentType = request.form.documentType;

  // - editState
  rawDocketEntry.editState = JSON.stringify({
    ...request.form,
    docketEntryId: rawDocketEntry.docketEntryId,
    docketNumber: rawDocketEntry.docketNumber,
  });

  // - freeText
  rawDocketEntry.freeText = request.form.freeText;

  // - filingDate: same as serve stamp
  rawDocketEntry.filingDate = timestamp;

  // - isDraft: false
  rawDocketEntry.isDraft = false;

  // - isFileAttached: true
  rawDocketEntry.isFileAttached = true;

  // - isOnDocketRecord: true
  rawDocketEntry.isOnDocketRecord = true;

  // - numberOfPages:
  rawDocketEntry.numberOfPages = numberOfPages;

  // - scenario: form.scenario
  rawDocketEntry.scenario = request.form.scenario;

  // - serviceStamp: form.serviceStamp
  rawDocketEntry.serviceStamp = request.form.serviceStamp;

  const docketEntry = new DocketEntry(rawDocketEntry, {
    applicationContext,
  }).validate();

  docketEntry.setAsServed(servedParties.all);

  docketEntry.servedAt = timestamp;

  console.log(docketEntry);

  if (performUpdate) {
    await applicationContext.getPersistenceGateway().updateDocketEntry({
      applicationContext,
      docketEntryId,
      docketNumber,
      document: docketEntry,
    });
  }

  // possibly close case
})();
