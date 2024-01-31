import { Client } from '@opensearch-project/opensearch';
import { areAllReindexTasksFinished } from './check-reindex-complete';
import { getClient } from '../../../web-api/elasticsearch/client';

jest.mock('../../../web-api/elasticsearch/client', () => ({
  getClient: jest.fn(),
}));
const mockedClient = jest.mocked(getClient);
const mockEnvName = 'experimental100';

describe('areAllReindexTasksFinished', () => {
  process.env.SOURCE_TABLE = 'efcms-experimental100-alpha';
  const tasks = jest.fn();
  const mockTasks = { cat: { tasks } } as unknown as Client;
  console.log = () => null;

  beforeEach(() => {
    mockedClient.mockReturnValue(Promise.resolve(mockTasks));
  });

  it('returns true when no tasks are ongoing', async () => {
    tasks.mockReturnValue({ body: [] });
    const result = await areAllReindexTasksFinished({
      environmentName: mockEnvName,
    });
    expect(result).toBe(true);
  });

  it('returns true when no reindex tasks are ongoing', async () => {
    tasks.mockReturnValue({
      body: [
        {
          action: 'cluster:monitor/tasks/lists',
          task_id: 'AbC-deFGhIjklMnOPqR:4000209',
        },
        {
          action: 'cluster:monitor/tasks/lists[n]',
          parent_task_id: 'AbC-deFGhIjklMnOPqR:4000209',
          task_id: 'AbC-deFGhIjklMnOPqR:4000210',
        },
      ],
    });
    const result = await areAllReindexTasksFinished({
      environmentName: mockEnvName,
    });
    expect(result).toBe(true);
  });

  it('returns false when a reindex task is ongoing', async () => {
    tasks.mockReturnValue({
      body: [
        {
          action: 'indices:data/write/reindex',
          task_id: 'AbC-deFGhIjklMnOPqR:4000211',
        },
        {
          action: 'indices:data/write/bulk',
          parent_task_id: 'AbC-deFGhIjklMnOPqR:4000211',
          task_id: 'AbC-deFGhIjklMnOPqR:4000212',
        },
        {
          action: 'cluster:monitor/tasks/lists',
          task_id: 'AbC-deFGhIjklMnOPqR:4000213',
        },
        {
          action: 'cluster:monitor/tasks/lists[n]',
          parent_task_id: 'AbC-deFGhIjklMnOPqR:4000213',
          task_id: 'AbC-deFGhIjklMnOPqR:4000214',
        },
      ],
    });
    const result = await areAllReindexTasksFinished({
      environmentName: mockEnvName,
    });
    expect(result).toBe(false);
  });
});
