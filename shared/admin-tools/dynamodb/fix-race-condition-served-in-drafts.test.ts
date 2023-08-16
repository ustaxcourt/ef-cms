/*
 * @jest-environment node
 */
import { DynamoDBClient, GetItemCommand } from '@aws-sdk/client-dynamodb';
import { MOCK_DOCUMENTS } from '../../src/test/mockDocketEntry';
import { applicationContext } from '../../src/business/test/createTestApplicationContext';
import {
  fixRaceConditionServedInDrafts,
  getDocumentFromDynamo,
} from './fix-race-condition-served-in-drafts';
import { marshall } from '@aws-sdk/util-dynamodb';
import { mockClient } from 'aws-sdk-client-mock';

const mockedDDBClient = mockClient(DynamoDBClient);
const mockedItem = MOCK_DOCUMENTS[0];
const mockedMarshalledItem = marshall(mockedItem);

describe('getDocumentFromDynamo', () => {
  beforeEach(() => {
    mockedDDBClient.reset();
  });

  it('return the unmarshalled item it found in the database', async () => {
    mockedDDBClient.on(GetItemCommand).resolves({
      Item: mockedMarshalledItem,
    });

    const result = await getDocumentFromDynamo({
      docketEntryId: 'foo',
      docketNumber: 'bar',
    });
    expect(result).toEqual(mockedItem);
  });

  it('return undefined if it did not find an item in the database', async () => {
    mockedDDBClient.on(GetItemCommand).resolves({});

    const result = await getDocumentFromDynamo({
      docketEntryId: 'foo',
      docketNumber: 'bar',
    });
    expect(result).toBeUndefined();
  });
});

describe('fixRaceConditionServedInDrafts', () => {
  const mockedFilingDate = '2018-03-01T00:01:00.000Z';
  let mockCall;
  let mockPerformUpdate = true;
  let mockRequest = {
    form: {
      attachments: true,
      date: mockedFilingDate,
      documentType: 'Order',
      freeText: 'get what you pay for',
      generatedDocumentTitle: 'A Generated Title',
      scenario: 'Nonstandard H',
      serviceStamp: 'Entered and Served',
    },
  };
  const mockNumPages = 5;

  beforeAll(() => {
    applicationContext.getUseCaseHelpers().countPagesInDocument = jest
      .fn()
      .mockReturnValue(mockNumPages);
  });

  beforeEach(() => {
    mockedDDBClient.reset();
    mockedDDBClient.on(GetItemCommand).resolves({
      Item: mockedMarshalledItem,
    });
    mockPerformUpdate = true;
    mockCall = {
      docketEntryId: mockedItem.docketEntryId,
      docketNumber: mockedItem.docketNumber,
      performUpdate: mockPerformUpdate,
      request: mockRequest,
      timestamp: mockedFilingDate,
    };
  });

  it('looks up the subject case for the specified docketNumber', async () => {
    await fixRaceConditionServedInDrafts(applicationContext, mockCall);
    expect(
      applicationContext.getPersistenceGateway().getCaseByDocketNumber,
    ).toHaveBeenCalledWith({
      applicationContext,
      docketNumber: mockedItem.docketNumber,
    });
  });

  it('calculates the number of pages in the document', async () => {
    await fixRaceConditionServedInDrafts(applicationContext, mockCall);
    expect(
      applicationContext.getUseCaseHelpers().countPagesInDocument,
    ).toHaveBeenCalledWith({
      applicationContext,
      docketEntryId: mockCall.docketEntryId,
    });
  });

  it('does not update the docket entry if the performUpdate flag is false', async () => {
    mockCall.performUpdate = false;
    await fixRaceConditionServedInDrafts(applicationContext, mockCall);
    expect(
      applicationContext.getPersistenceGateway().updateDocketEntry,
    ).not.toHaveBeenCalled();
  });

  it('updates the docket entry with updated attributes if the performUpdate flag is true', async () => {
    await fixRaceConditionServedInDrafts(applicationContext, mockCall);
    expect(
      applicationContext.getPersistenceGateway().updateDocketEntry,
    ).toHaveBeenCalledWith({
      applicationContext,
      docketEntryId: mockedItem.docketEntryId,
      docketNumber: mockedItem.docketNumber,
      document: expect.objectContaining({
        // ...mockedItem,
        attachments: mockRequest.form.attachments,
        date: mockedFilingDate,
        documentTitle: mockRequest.form.generatedDocumentTitle,
        documentType: mockRequest.form.documentType,
        editState: JSON.stringify({
          ...mockRequest.form,
          docketEntryId: mockedItem.docketEntryId,
          docketNumber: mockedItem.docketNumber,
        }),
        filingDate: mockedFilingDate,
        freeText: mockRequest.form.freeText,
        isDraft: false,
        isFileAttached: true,
        isOnDocketRecord: true,
        numberOfPages: mockNumPages,
        scenario: mockRequest.form.scenario,
        servedAt: mockedFilingDate,
        serviceStamp: mockRequest.form.serviceStamp,
      }),
    });
  });
});
