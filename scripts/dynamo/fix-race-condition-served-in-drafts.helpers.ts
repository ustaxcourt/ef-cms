#!/usr/bin/env -S npx ts-node --transpile-only

import { Case } from '@shared/business/entities/cases/Case';
import { DocketEntry } from '@shared/business/entities/DocketEntry';
import { DynamoDBClient, GetItemCommand } from '@aws-sdk/client-dynamodb';
import { aggregatePartiesForService } from '@shared/business/utilities/aggregatePartiesForService';
import { unmarshall } from '@aws-sdk/util-dynamodb';
import { getCaseByDocketNumber } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import { upsertDocketEntries } from '@web-api/persistence/postgres/docketEntries/upsertDocketEntries';

export const getDocumentFromDynamo = async ({
  docketEntryId,
  docketNumber,
}: {
  docketEntryId: string;
  docketNumber: string;
}): Promise<Record<string, any> | undefined> => {
  const dynamoClient = new DynamoDBClient({
    region: 'us-east-1',
  });

  // Get Docket Entry record from DB
  const command = new GetItemCommand({
    Key: {
      pk: {
        S: `case|${docketNumber}`,
      },
      sk: {
        S: `docket-entry|${docketEntryId}`,
      },
    },

    TableName: process.env.DYNAMODB_TABLE_NAME,
  });

  const res = await dynamoClient.send(command);

  if (!res || !res.Item) {
    console.log(
      `could not find record for case|${docketNumber} docket-entry|${docketEntryId}`,
    );
    return;
  }
  return unmarshall(res.Item);
};

export const fixRaceConditionServedInDrafts = async (
  applicationContext: any,
  {
    docketEntryId,
    docketNumber,
    performUpdate,
    request,
    timestamp,
  }: {
    docketEntryId: string;
    docketNumber: string;
    performUpdate: boolean;
    request: any;
    timestamp: string;
  },
) => {
  const subjectCase = await getCaseByDocketNumber({
    applicationContext,
    docketNumber,
  });
  const caseEntity = new Case(subjectCase, { authorizedUser: undefined });

  const servedParties = aggregatePartiesForService(caseEntity);

  const rawDocketEntry = await getDocumentFromDynamo({
    docketEntryId,
    docketNumber,
  });

  if (!rawDocketEntry) {
    console.log(
      `could not find record for case|${docketNumber} docket-entry|${docketEntryId}`,
    );
    return;
  }

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

  // TODO: figure out index

  const docketEntry = new DocketEntry(rawDocketEntry, {
    authorizedUser: undefined,
  }).validate();

  docketEntry.setAsServed(servedParties.all);

  docketEntry.servedAt = timestamp;

  console.log(docketEntry);

  if (performUpdate) {
    await upsertDocketEntries([docketEntry]);
  }
};
