import { update } from '../../dynamodbClientService';
import { applicationContext } from '../../../business/test/createTestApplicationContext';
import { CASE_STATUS_TYPES } from '../../../business/entities/EntityConstants';
import { updateDocketEntryProcessingStatus } from './updateDocketEntryProcessingStatus';

jest.mock('../../dynamodbClientService');

const updateMock = update as jest.Mock;

describe('updateDocketEntryProcessingStatus', () => {
  beforeAll(() => {
    applicationContext.filterCaseMetadata.mockImplementation(
      ({ cases }) => cases,
    );

    updateMock.mockReturnValue({
      docketNumber: '123-20',
      pk: '123',
      sk: '123',
      status: CASE_STATUS_TYPES.new,
    });
  });

  it('should attempt to do a batch get in the same ids that were returned in the mapping records', async () => {
    await updateDocketEntryProcessingStatus({
      applicationContext,
      docketEntryId: '3',
      docketNumber: '123-20',
    });
    expect(updateMock.mock.calls[0][0]).toMatchObject({
      Key: { pk: 'case|123-20', sk: 'docket-entry|3' },
      UpdateExpression: 'SET #processingStatus = :status',
    });
  });
});
