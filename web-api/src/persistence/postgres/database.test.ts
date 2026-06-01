jest.mock('@web-api/persistence/postgres/databaseConnection');
jest.mock('../../../elasticsearch/cases/transformOpenSearchCases');
jest.mock('@web-api/gateways/openSearch/openSearchGateway');
jest.mock('@web-api/persistence/postgres/utils/transactions');
import { runQuery as runQueryMock } from '@web-api/persistence/postgres/databaseConnection';
import { transformOpenSearchCases as transformOpenSearchCasesMock } from '../../../elasticsearch/cases/transformOpenSearchCases';
import {
  inTransaction as inTransactionMock,
  onTransactionCommit as onTransactionCommitMock,
} from '@web-api/persistence/postgres/utils/transactions';
import { OPENSEARCH_SYNC_ACTIONS } from '@web-api/lambdas/openSearch/openSearchSyncHandler';
import { getDbWriter } from '@web-api/persistence/postgres/database';

const runQuery = jest.mocked(runQueryMock);
const transformOpenSearchCases = jest.mocked(transformOpenSearchCasesMock);
const inTransaction = jest.mocked(inTransactionMock);
const onTransactionCommit = jest.mocked(onTransactionCommitMock);

const mockOpenSearchQueueSync = jest.fn();

jest.mock('@web-api/gateways/openSearch/openSearchGateway', () => ({
  openSearchGateway: () => ({
    queueSync: mockOpenSearchQueueSync,
  }),
}));

describe('Testing opensearch sync in a transaction', () => {
  beforeAll(() => {
    transformOpenSearchCases.mockReturnValue(['opensearch message']);
    onTransactionCommit.mockImplementation(() => {});
    runQuery.mockResolvedValue(null);
  });

  it('should send open search message immediately when not in a transaction', async () => {
    inTransaction.mockReturnValue(false);
    await getDbWriter({
      cb: async () => {},
      table: 'dwCase',
      action: OPENSEARCH_SYNC_ACTIONS.UPSERT,
    });

    expect(mockOpenSearchQueueSync).toHaveBeenCalledTimes(1);
  });

  it('should not call open search message function if in a transaction', async () => {
    inTransaction.mockReturnValue(true);
    runQuery.mockResolvedValueOnce(null);
    await getDbWriter({
      cb: async () => {},
      table: 'dwCase',
      action: OPENSEARCH_SYNC_ACTIONS.UPSERT,
    });

    expect(mockOpenSearchQueueSync).not.toHaveBeenCalled();
    expect(onTransactionCommit).toHaveBeenCalled();
  });
});
