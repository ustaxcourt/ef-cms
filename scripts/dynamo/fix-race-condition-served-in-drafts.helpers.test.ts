/*
 * @jest-environment node
 */
import '@web-api/persistence/postgres/caseCorrespondences/mocks.jest';
import '@web-api/persistence/postgres/cases/mocks.jest';
import '@web-api/persistence/postgres/workitems/mocks.jest';
import { DynamoDBClient, GetItemCommand } from '@aws-sdk/client-dynamodb';
import { MOCK_DOCUMENTS } from '@shared/test/mockDocketEntry';
import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import {
  fixRaceConditionServedInDrafts,
  getDocumentFromDynamo,
} from './fix-race-condition-served-in-drafts.helpers';
import { marshall } from '@aws-sdk/util-dynamodb';
import { mockClient } from 'aws-sdk-client-mock';
import { getCaseByDocketNumber as getCaseByDocketNumberMock } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import { MOCK_CASE } from '@shared/test/mockCase';

const mockedDDBClient = mockClient(DynamoDBClient);
const mockedItem = MOCK_DOCUMENTS[0];
const mockedMarshalledItem = marshall(mockedItem);
const getCaseByDocketNumber = getCaseByDocketNumberMock as jest.Mock;
getCaseByDocketNumber.mockResolvedValue(MOCK_CASE);

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
  const mockRequest = {
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

  it('logs an error and returns if it can not look up the docket entry', async () => {
    mockedDDBClient.on(GetItemCommand).resolvesOnce({});
    await fixRaceConditionServedInDrafts(applicationContext, mockCall);
    expect(
      applicationContext.getUseCaseHelpers().countPagesInDocument,
    ).not.toHaveBeenCalled();
  });

  it('looks up the subject case for the specified docketNumber', async () => {
    await fixRaceConditionServedInDrafts(applicationContext, mockCall);
    expect(getCaseByDocketNumber).toHaveBeenCalledWith({
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
