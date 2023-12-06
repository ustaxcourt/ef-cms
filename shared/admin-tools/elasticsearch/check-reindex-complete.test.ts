import { Client } from '@opensearch-project/opensearch';
import {
  areAllReindexTasksFinished,
  isMigratedClusterFinishedIndexing,
} from './check-reindex-complete';
import { getClient } from '../../../web-api/elasticsearch/client';

jest.mock('../../../web-api/elasticsearch/client', () => ({
  getClient: jest.fn(),
}));
const mockedClient = jest.mocked(getClient);
const mockEnvName = 'experimental100';

describe('isMigratedClusterFinishedIndexing', () => {
  const count = jest.fn();
  const stats = jest.fn();
  const mockIndices = { count, indices: { stats } } as unknown as Client;
  console.log = () => null;

  beforeEach(() => {
    mockedClient.mockReturnValue(Promise.resolve(mockIndices));
    stats.mockReturnValue({
      body: {
        indices: {
          'efcms-case-1606697c873c048d173577bd96b6e37e': {
            total: {
              translog: { operations: 0 },
            },
          },
          'efcms-case-deadline-2bbdef41ec5123500f0f498cd3cfaf01': {
            total: {
              translog: { operations: 0 },
            },
          },
          'efcms-docket-entry-b4c228de040c11354d0f97a2cdc12273': {
            total: {
              translog: { operations: 0 },
            },
          },
          'efcms-message-9c8a43cb1c57a27ef1c2102ac721fa1e': {
            total: {
              translog: { operations: 0 },
            },
          },
          'efcms-user-7edfdb73a94767780dcb25a46459a6c9': {
            total: {
              translog: { operations: 0 },
            },
          },
          'efcms-work-item-b9885503ad198716d834417a6ed3d53c': {
            total: {
              translog: { operations: 0 },
            },
          },
        },
      },
    });
  });

  it('calls getClient with the correct environment and table versions when destination table is alpha', async () => {
    count
      .mockReturnValueOnce({ body: { count: 9 } })
      .mockReturnValueOnce({ body: { count: 8 } })
      .mockReturnValueOnce({ body: { count: 5 } })
      .mockReturnValueOnce({ body: { count: 7 } })
      .mockReturnValueOnce({ body: { count: 4 } })
      .mockReturnValueOnce({ body: { count: 6 } })
      .mockReturnValueOnce({ body: { count: 3 } })
      .mockReturnValueOnce({ body: { count: 3 } })
      .mockReturnValueOnce({ body: { count: 3 } })
      .mockReturnValueOnce({ body: { count: 3 } })
      .mockReturnValueOnce({ body: { count: 3 } })
      .mockReturnValueOnce({ body: { count: 3 } });

    process.env.DESTINATION_TABLE = 'efcms-exp100-alpha';
    await isMigratedClusterFinishedIndexing({ environmentName: mockEnvName });

    expect(mockedClient.mock.calls[0][0]).toMatchObject({ version: 'beta' });
    expect(mockedClient.mock.calls[1][0]).toMatchObject({ version: 'alpha' });
  });

  it('calls getClient with the correct environment and table versions when destination table is beta', async () => {
    count
      .mockReturnValueOnce({ body: { count: 9 } })
      .mockReturnValueOnce({ body: { count: 8 } })
      .mockReturnValueOnce({ body: { count: 5 } })
      .mockReturnValueOnce({ body: { count: 7 } })
      .mockReturnValueOnce({ body: { count: 4 } })
      .mockReturnValueOnce({ body: { count: 6 } })
      .mockReturnValueOnce({ body: { count: 3 } })
      .mockReturnValueOnce({ body: { count: 3 } })
      .mockReturnValueOnce({ body: { count: 3 } })
      .mockReturnValueOnce({ body: { count: 3 } })
      .mockReturnValueOnce({ body: { count: 3 } })
      .mockReturnValueOnce({ body: { count: 3 } });

    process.env.DESTINATION_TABLE = 'efcms-exp100-beta';
    await isMigratedClusterFinishedIndexing({ environmentName: mockEnvName });

    expect(mockedClient.mock.calls[0][0]).toMatchObject({ version: 'alpha' });
    expect(mockedClient.mock.calls[1][0]).toMatchObject({ version: 'beta' });
  });

  it('returns false when there is a difference in the current and destination index count', async () => {
    count
      .mockReturnValueOnce({ body: { count: 9 } })
      .mockReturnValueOnce({ body: { count: 8 } })
      .mockReturnValueOnce({ body: { count: 5 } })
      .mockReturnValueOnce({ body: { count: 7 } })
      .mockReturnValueOnce({ body: { count: 4 } })
      .mockReturnValueOnce({ body: { count: 6 } })
      .mockReturnValueOnce({ body: { count: 3 } })
      .mockReturnValueOnce({ body: { count: 3 } })
      .mockReturnValueOnce({ body: { count: 3 } })
      .mockReturnValueOnce({ body: { count: 3 } })
      .mockReturnValueOnce({ body: { count: 3 } })
      .mockReturnValueOnce({ body: { count: 3 } });

    const result = await isMigratedClusterFinishedIndexing({
      environmentName: mockEnvName,
    });
    expect(result).toBe(false);
  });

  it('returns false when there is no difference in the current and destination index count and elasticsearch is still reindexing', async () => {
    count
      .mockReturnValueOnce({ body: { count: 9 } })
      .mockReturnValueOnce({ body: { count: 8 } })
      .mockReturnValueOnce({ body: { count: 5 } })
      .mockReturnValueOnce({ body: { count: 7 } })
      .mockReturnValueOnce({ body: { count: 4 } })
      .mockReturnValueOnce({ body: { count: 6 } })
      .mockReturnValueOnce({ body: { count: 9 } })
      .mockReturnValueOnce({ body: { count: 8 } })
      .mockReturnValueOnce({ body: { count: 5 } })
      .mockReturnValueOnce({ body: { count: 7 } })
      .mockReturnValueOnce({ body: { count: 4 } })
      .mockReturnValueOnce({ body: { count: 6 } });

    stats
      .mockReturnValueOnce({
        body: {
          indices: {
            'efcms-case-1606697c873c048d173577bd96b6e37e': {
              total: {
                translog: {
                  operations: 0,
                },
              },
            },
            'efcms-case-deadline-2bbdef41ec5123500f0f498cd3cfaf01': {
              total: {
                translog: {
                  operations: 0,
                },
              },
            },
            'efcms-docket-entry-b4c228de040c11354d0f97a2cdc12273': {
              total: {
                translog: {
                  operations: 0,
                },
              },
            },
            'efcms-message-9c8a43cb1c57a27ef1c2102ac721fa1e': {
              total: {
                translog: {
                  operations: 0,
                },
              },
            },
            'efcms-user-7edfdb73a94767780dcb25a46459a6c9': {
              total: {
                translog: {
                  operations: 0,
                },
              },
            },
            'efcms-work-item-b9885503ad198716d834417a6ed3d53c': {
              total: {
                translog: {
                  operations: 0,
                },
              },
            },
          },
        },
      })
      .mockReturnValueOnce({
        body: {
          indices: {
            'efcms-case-1606697c873c048d173577bd96b6e37e': {
              total: {
                translog: {
                  operations: 0,
                },
              },
            },
            'efcms-case-deadline-2bbdef41ec5123500f0f498cd3cfaf01': {
              total: {
                translog: {
                  operations: 0,
                },
              },
            },
            'efcms-docket-entry-b4c228de040c11354d0f97a2cdc12273': {
              total: {
                translog: {
                  operations: 0,
                },
              },
            },
            'efcms-message-9c8a43cb1c57a27ef1c2102ac721fa1e': {
              total: {
                translog: {
                  operations: 0,
                },
              },
            },
            'efcms-user-7edfdb73a94767780dcb25a46459a6c9': {
              total: {
                translog: {
                  operations: 0,
                },
              },
            },
            'efcms-work-item-b9885503ad198716d834417a6ed3d53c': {
              total: {
                translog: {
                  operations: 3,
                },
              },
            },
          },
        },
      });

    const result = await isMigratedClusterFinishedIndexing({
      environmentName: mockEnvName,
    });
    expect(result).toBe(false);
  });

  it('returns true when there is no difference in the current and destination index count and elasticsearch is finished reindexing', async () => {
    count
      .mockReturnValueOnce({ body: { count: 9 } })
      .mockReturnValueOnce({ body: { count: 8 } })
      .mockReturnValueOnce({ body: { count: 5 } })
      .mockReturnValueOnce({ body: { count: 7 } })
      .mockReturnValueOnce({ body: { count: 4 } })
      .mockReturnValueOnce({ body: { count: 6 } })
      .mockReturnValueOnce({ body: { count: 9 } })
      .mockReturnValueOnce({ body: { count: 8 } })
      .mockReturnValueOnce({ body: { count: 5 } })
      .mockReturnValueOnce({ body: { count: 7 } })
      .mockReturnValueOnce({ body: { count: 4 } })
      .mockReturnValueOnce({ body: { count: 6 } });

    stats
      .mockReturnValueOnce({
        body: {
          indices: {
            'efcms-case-1606697c873c048d173577bd96b6e37e': {
              total: {
                translog: {
                  operations: 0,
                },
              },
            },
            'efcms-case-deadline-2bbdef41ec5123500f0f498cd3cfaf01': {
              total: {
                translog: {
                  operations: 0,
                },
              },
            },
            'efcms-docket-entry-b4c228de040c11354d0f97a2cdc12273': {
              total: {
                translog: {
                  operations: 0,
                },
              },
            },
            'efcms-message-9c8a43cb1c57a27ef1c2102ac721fa1e': {
              total: {
                translog: {
                  operations: 0,
                },
              },
            },
            'efcms-user-7edfdb73a94767780dcb25a46459a6c9': {
              total: {
                translog: {
                  operations: 0,
                },
              },
            },
            'efcms-work-item-b9885503ad198716d834417a6ed3d53c': {
              total: {
                translog: {
                  operations: 0,
                },
              },
            },
          },
        },
      })
      .mockReturnValueOnce({
        body: {
          indices: {
            'efcms-case-1606697c873c048d173577bd96b6e37e': {
              total: {
                translog: {
                  operations: 0,
                },
              },
            },
            'efcms-case-deadline-2bbdef41ec5123500f0f498cd3cfaf01': {
              total: {
                translog: {
                  operations: 0,
                },
              },
            },
            'efcms-docket-entry-b4c228de040c11354d0f97a2cdc12273': {
              total: {
                translog: {
                  operations: 0,
                },
              },
            },
            'efcms-message-9c8a43cb1c57a27ef1c2102ac721fa1e': {
              total: {
                translog: {
                  operations: 0,
                },
              },
            },
            'efcms-user-7edfdb73a94767780dcb25a46459a6c9': {
              total: {
                translog: {
                  operations: 0,
                },
              },
            },
            'efcms-work-item-b9885503ad198716d834417a6ed3d53c': {
              total: {
                translog: {
                  operations: 0,
                },
              },
            },
          },
        },
      });

    const result = await isMigratedClusterFinishedIndexing({
      environmentName: mockEnvName,
    });
    expect(result).toBe(true);
  });

  it('is able to compare counts that do not match across clusters with indexes with different mappings', async () => {
    count
      .mockReturnValueOnce({ body: { count: 9 } })
      .mockReturnValueOnce({ body: { count: 8 } })
      .mockReturnValueOnce({ body: { count: 5 } })
      .mockReturnValueOnce({ body: { count: 7 } })
      .mockReturnValueOnce({ body: { count: 4 } })
      .mockReturnValueOnce({ body: { count: 6 } })
      .mockReturnValueOnce({ body: { count: 3 } })
      .mockReturnValueOnce({ body: { count: 3 } })
      .mockReturnValueOnce({ body: { count: 3 } })
      .mockReturnValueOnce({ body: { count: 3 } })
      .mockReturnValueOnce({ body: { count: 3 } })
      .mockReturnValueOnce({ body: { count: 3 } });

    stats
      .mockReturnValueOnce({
        body: {
          indices: {
            'efcms-case-1606697c873c048d173577bd96b6e37e': {
              total: {
                translog: {
                  operations: 0,
                },
              },
            },
            'efcms-case-deadline-2bbdef41ec5123500f0f498cd3cfaf01': {
              total: {
                translog: {
                  operations: 0,
                },
              },
            },
            'efcms-docket-entry-b4c228de040c11354d0f97a2cdc12273': {
              total: {
                translog: {
                  operations: 0,
                },
              },
            },
            'efcms-message-9c8a43cb1c57a27ef1c2102ac721fa1e': {
              total: {
                translog: {
                  operations: 0,
                },
              },
            },
            'efcms-user-7edfdb73a94767780dcb25a46459a6c9': {
              total: {
                translog: {
                  operations: 0,
                },
              },
            },
            'efcms-work-item-b9885503ad198716d834417a6ed3d53c': {
              total: {
                translog: {
                  operations: 0,
                },
              },
            },
          },
        },
      })
      .mockReturnValueOnce({
        body: {
          indices: {
            'efcms-case-29a9bccb1a3317c65c0632b8744d3d6d': {
              total: {
                translog: {
                  operations: 6,
                },
              },
            },
            'efcms-case-deadline-81b4bd369bef9f27f8e1cd10790d1d50': {
              total: {
                translog: {
                  operations: 5,
                },
              },
            },
            'efcms-docket-entry-23f8a9a201381bf3bec28605f06c23d5': {
              total: {
                translog: {
                  operations: 2,
                },
              },
            },
            'efcms-message-fc7d35df731743cefb96d3b9b6956ae2': {
              total: {
                translog: {
                  operations: 4,
                },
              },
            },
            'efcms-user-0ad9b5c2285391cf2fd673cb69e0c454': {
              total: {
                translog: {
                  operations: 1,
                },
              },
            },
            'efcms-work-item-48f8255dd6d6d78ddc7a00f99208bbb3': {
              total: {
                translog: {
                  operations: 3,
                },
              },
            },
          },
        },
      });

    const result = await isMigratedClusterFinishedIndexing({
      environmentName: mockEnvName,
    });
    expect(result).toBe(false);
  });

  it('is able to determine when counts match across clusters with indexes with different mappings', async () => {
    count
      .mockReturnValueOnce({ body: { count: 9 } })
      .mockReturnValueOnce({ body: { count: 8 } })
      .mockReturnValueOnce({ body: { count: 5 } })
      .mockReturnValueOnce({ body: { count: 7 } })
      .mockReturnValueOnce({ body: { count: 4 } })
      .mockReturnValueOnce({ body: { count: 6 } })
      .mockReturnValueOnce({ body: { count: 9 } })
      .mockReturnValueOnce({ body: { count: 8 } })
      .mockReturnValueOnce({ body: { count: 5 } })
      .mockReturnValueOnce({ body: { count: 7 } })
      .mockReturnValueOnce({ body: { count: 4 } })
      .mockReturnValueOnce({ body: { count: 6 } });

    stats
      .mockReturnValueOnce({
        body: {
          indices: {
            'efcms-case-1606697c873c048d173577bd96b6e37e': {
              total: {
                translog: {
                  operations: 0,
                },
              },
            },
            'efcms-case-deadline-2bbdef41ec5123500f0f498cd3cfaf01': {
              total: {
                translog: {
                  operations: 0,
                },
              },
            },
            'efcms-docket-entry-b4c228de040c11354d0f97a2cdc12273': {
              total: {
                translog: {
                  operations: 0,
                },
              },
            },
            'efcms-message-9c8a43cb1c57a27ef1c2102ac721fa1e': {
              total: {
                translog: {
                  operations: 0,
                },
              },
            },
            'efcms-user-7edfdb73a94767780dcb25a46459a6c9': {
              total: {
                translog: {
                  operations: 0,
                },
              },
            },
            'efcms-work-item-b9885503ad198716d834417a6ed3d53c': {
              total: {
                translog: {
                  operations: 0,
                },
              },
            },
          },
        },
      })
      .mockReturnValueOnce({
        body: {
          indices: {
            'efcms-case-29a9bccb1a3317c65c0632b8744d3d6d': {
              total: {
                translog: {
                  operations: 0,
                },
              },
            },
            'efcms-case-deadline-81b4bd369bef9f27f8e1cd10790d1d50': {
              total: {
                translog: {
                  operations: 0,
                },
              },
            },
            'efcms-docket-entry-23f8a9a201381bf3bec28605f06c23d5': {
              total: {
                translog: {
                  operations: 0,
                },
              },
            },
            'efcms-message-fc7d35df731743cefb96d3b9b6956ae2': {
              total: {
                translog: {
                  operations: 0,
                },
              },
            },
            'efcms-user-0ad9b5c2285391cf2fd673cb69e0c454': {
              total: {
                translog: {
                  operations: 0,
                },
              },
            },
            'efcms-work-item-48f8255dd6d6d78ddc7a00f99208bbb3': {
              total: {
                translog: {
                  operations: 0,
                },
              },
            },
          },
        },
      });

    const result = await isMigratedClusterFinishedIndexing({
      environmentName: mockEnvName,
    });
    expect(result).toBe(true);
  });
});

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
