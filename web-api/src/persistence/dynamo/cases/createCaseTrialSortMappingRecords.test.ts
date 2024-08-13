import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { batchDelete, put, query, remove } from '../../dynamodbClientService';
import { createCaseTrialSortMappingRecords } from './createCaseTrialSortMappingRecords';

jest.mock('../../dynamodbClientService');

const queryMock = query as jest.Mock;
const removeMock = remove as jest.Mock;
const batchDeleteMock = batchDelete as jest.Mock;
const putMock = put as jest.Mock;

describe('createCaseTrialSortMappingRecords', () => {
  it('attempts to persist the case trial sort mapping records', async () => {
    queryMock.mockResolvedValue({ Items: [] });

    await createCaseTrialSortMappingRecords({
      applicationContext,
      caseSortTags: {
        hybrid: 'hybridSortRecord',
        nonHybrid: 'nonhybridSortRecord',
      },
      docketNumber: '123-20',
    });

    expect(putMock.mock.calls[0][0]).toMatchObject({
      Item: {
        docketNumber: '123-20',
        gsi1pk: 'eligible-for-trial-case-catalog|123-20',
        pk: 'eligible-for-trial-case-catalog',
        sk: 'nonhybridSortRecord',
      },
    });
    expect(putMock.mock.calls[1][0]).toMatchObject({
      Item: {
        docketNumber: '123-20',
        gsi1pk: 'eligible-for-trial-case-catalog|123-20',
        pk: 'eligible-for-trial-case-catalog',
        sk: 'hybridSortRecord',
      },
    });

    expect(removeMock.mock.calls.length).toEqual(0);
  });

  it('deletes old mapping records for the given case if they exist', async () => {
    queryMock.mockResolvedValue([{ sk: 'abc' }, { sk: '123' }]);

    await createCaseTrialSortMappingRecords({
      applicationContext,
      caseSortTags: {
        hybrid: 'hybridSortRecord',
        nonHybrid: 'nonhybridSortRecord',
      },
      docketNumber: '123-20',
    });

    expect(batchDeleteMock.mock.calls.length).toEqual(1);
  });
});
