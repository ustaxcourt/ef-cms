import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { deleteDocketEntry } from './deleteDocketEntry';
import { remove } from '../../dynamodbClientService';

jest.mock('../../dynamodbClientService');

const mockDocketEntryId = '9b52c605-edba-41d7-b045-d5f992a499d3';
const mockDocketNumber = '999-99';

describe('deleteDocketEntry', () => {
  beforeAll(() => {
    applicationContext.filterCaseMetadata.mockImplementation(
      ({ cases }) => cases,
    );
  });

  it('makes a delete request with the given docket entry data for the matching docketEntryId', async () => {
    await deleteDocketEntry({
      applicationContext,
      docketEntryId: mockDocketEntryId,
      docketNumber: mockDocketNumber,
    });

    expect((remove as jest.Mock).mock.calls[0][0]).toMatchObject({
      key: {
        pk: `case|${mockDocketNumber}`,
        sk: `docket-entry|${mockDocketEntryId}`,
      },
    });
  });
});
