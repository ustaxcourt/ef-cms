import { Worker } from 'worker_threads';
import { getDbReader } from '@web-api/persistence/postgres/database';
import { getCasesByDocketNumbers } from '@web-api/persistence/postgres/cases/getCasesByDocketNumbers';
import { fromKyselyMessage } from '@web-api/persistence/postgres/messages/mapper';
import { fromKyselyNewTrialSessionWorkingCopy } from '@web-api/persistence/postgres/trialSessions/mapper';
import { fromKyselyUser } from '@web-api/persistence/postgres/users/mapper';
import { getCurrentDateTimeInMillis } from '@shared/business/utilities/DateHandler';
import { createSpinner } from '../helpers/consoleSpinner';
import os from 'os';
import {
  entityValidationFunctions,
  getAllMessages,
} from './entityValidationHelper';

// Proxy-based fluent Kysely chain. .then/.catch return undefined so the proxy
// is never treated as thenable by await.
const mockBuildFluentChain = (rows: any[] = []) => {
  const proxy: any = new Proxy(
    {},
    {
      get(_, prop) {
        if (prop === 'then' || prop === 'catch' || prop === 'finally') {
          return undefined;
        }
        if (prop === 'execute') return () => Promise.resolve(rows);
        return () => proxy;
      },
    },
  );
  return proxy;
};

// Worker mock that fires message or error synchronously when postMessage is called.
const mockCreateWorkerInstance = (
  options: { response?: string[]; error?: Error } = {},
) => {
  const handlers: Record<string, Array<(...args: any[]) => void>> = {};
  return {
    once(event: string, handler: (...args: any[]) => void) {
      handlers[event] = handlers[event] ?? [];
      handlers[event].push(handler);
      return this;
    },
    removeListener(event: string, handler: (...args: any[]) => void) {
      handlers[event] = (handlers[event] ?? []).filter(h => h !== handler);
      return this;
    },
    postMessage(_data: any) {
      if (options.error) {
        const errorHandlers = [...(handlers['error'] ?? [])];
        handlers['error'] = [];
        errorHandlers.forEach(h => h(options.error));
      } else {
        const messageHandlers = [...(handlers['message'] ?? [])];
        handlers['message'] = [];
        messageHandlers.forEach(h => h(options.response ?? []));
      }
    },
    terminate: jest.fn().mockResolvedValue(0),
  };
};

jest.mock('@shared/business/utilities/DateHandler', () => ({
  getCurrentDateTimeInMillis: jest.fn().mockReturnValue(0),
}));
jest.mock('worker_threads', () => ({ Worker: jest.fn() }));
jest.mock('@web-api/persistence/postgres/database', () => ({ getDbReader: jest.fn() }));
jest.mock(
  '@web-api/persistence/postgres/cases/getCasesByDocketNumbers',
  () => ({ getCasesByDocketNumbers: jest.fn().mockResolvedValue([]) }),
);
jest.mock(
  '@web-api/persistence/postgres/trialSessions/getTrialSessions',
  () => ({ getTrialSessions: jest.fn().mockResolvedValue([]) }),
);
jest.mock('@web-api/persistence/postgres/messages/mapper', () => ({
  fromKyselyMessage: jest.fn(x => x),
}));
jest.mock('@web-api/persistence/postgres/trialSessions/mapper', () => ({
  fromKyselyNewTrialSessionWorkingCopy: jest.fn(x => x),
}));
jest.mock('@web-api/persistence/postgres/users/mapper', () => ({
  fromKyselyUser: jest.fn(x => x),
}));
jest.mock('@web-api/persistence/postgres/workitems/mapper', () => ({
  fromKyselyWorkItem: jest.fn(x => x),
}));
jest.mock('../helpers/consoleSpinner', () => ({
  createSpinner: jest.fn(),
}));
jest.mock('os', () => ({
  cpus: jest.fn().mockReturnValue(new Array(4).fill({ model: 'CPU' })),
}));

describe('entityValidationHelper', () => {
  const mockSpinner = {
    update: jest.fn(),
    fail: jest.fn(),
    succeed: jest.fn(),
  };

  beforeEach(() => {
    (createSpinner as jest.Mock).mockReturnValue(mockSpinner);
    (getDbReader as jest.Mock).mockImplementation((cb: any) =>
      cb(mockBuildFluentChain()),
    );
    (Worker as unknown as jest.Mock).mockImplementation(() =>
      mockCreateWorkerInstance(),
    );
    (os.cpus as jest.Mock).mockReturnValue(new Array(4).fill({ model: 'CPU' }));
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('exports all expected entity validation functions', () => {
    expect(entityValidationFunctions).toMatchObject({
      Case: expect.any(Function),
      Message: expect.any(Function),
      PractitionerDocument: expect.any(Function),
      TrialSession: expect.any(Function),
      TrialSessionWorkingCopy: expect.any(Function),
      User: expect.any(Function),
      WorkItem: expect.any(Function),
    });
  });

  it('WorkItem - returns an empty array when there are no validation errors', async () => {
    const result = await entityValidationFunctions.WorkItem();
    expect(result).toEqual([]);
    expect(mockSpinner.succeed).toHaveBeenCalled();
  });

  it('WorkItem - returns validation errors reported by the worker', async () => {
    (Worker as unknown as jest.Mock).mockImplementation(() =>
      mockCreateWorkerInstance({ response: ['error1', 'error2'] }),
    );
    (getDbReader as jest.Mock).mockImplementation((cb: any) =>
      cb(mockBuildFluentChain([{ workItemId: '1' }])),
    );

    const result = await entityValidationFunctions.WorkItem();
    expect(result).toEqual(['error1', 'error2']);
    expect(mockSpinner.fail).toHaveBeenCalled();
  });

  it('WorkItem - throws when a worker thread crashes', async () => {
    (Worker as unknown as jest.Mock).mockImplementation(() =>
      mockCreateWorkerInstance({ error: new Error('Worker crashed') }),
    );
    (getDbReader as jest.Mock).mockImplementation((cb: any) =>
      cb(mockBuildFluentChain([{ workItemId: '1' }])),
    );

    await expect(entityValidationFunctions.WorkItem()).rejects.toThrow(
      'Worker crashed',
    );
    expect(console.error).toHaveBeenCalledWith(
      expect.stringContaining('WorkItem'),
      expect.any(Error),
    );
  });

  it('WorkItem - throws when a DB/infrastructure error occurs', async () => {
    (getDbReader as jest.Mock).mockRejectedValue(
      new Error('DB connection failed'),
    );

    await expect(entityValidationFunctions.WorkItem()).rejects.toThrow(
      'DB connection failed',
    );
    expect(console.error).toHaveBeenCalledWith(
      expect.stringContaining('WorkItem'),
      expect.any(Error),
    );
  });

  it('Message - returns an empty array when all messages are valid', async () => {
    const result = await entityValidationFunctions.Message();
    expect(result).toEqual([]);
  });

  it('User - returns an empty array when all users are valid', async () => {
    const result = await entityValidationFunctions.User();
    expect(result).toEqual([]);
  });

  it('PractitionerDocument - returns an empty array when all documents are valid', async () => {
    const result = await entityValidationFunctions.PractitionerDocument();
    expect(result).toEqual([]);
  });

  it('TrialSessionWorkingCopy - returns an empty array when all records are valid', async () => {
    const result = await entityValidationFunctions.TrialSessionWorkingCopy();
    expect(result).toEqual([]);
  });

  it('TrialSession - returns an empty array when all trial sessions are valid', async () => {
    const result = await entityValidationFunctions.TrialSession();
    expect(result).toEqual([]);
  });

  it('Case - returns an empty array when there are no docket numbers', async () => {
    const result = await entityValidationFunctions.Case();
    expect(result).toEqual([]);
    expect(getCasesByDocketNumbers).not.toHaveBeenCalled();
  });

  it('Case - fetches cases in batches and returns validation errors', async () => {
    (Worker as unknown as jest.Mock).mockImplementation(() =>
      mockCreateWorkerInstance({ response: ['case-error'] }),
    );
    (getDbReader as jest.Mock).mockImplementation((cb: any) =>
      cb(mockBuildFluentChain([{ docketNumber: '101-23' }])),
    );
    (getCasesByDocketNumbers as jest.Mock).mockResolvedValue([
      { docketNumber: '101-23' },
    ]);

    const result = await entityValidationFunctions.Case();
    expect(result).toContain('case-error');
    expect(getCasesByDocketNumbers).toHaveBeenCalled();
  });

  it('getAllMessages - applies limit when provided', async () => {
    const result = await getAllMessages(5);
    expect(result).toEqual([]);
  });

  it('getAllMessages - applies limit and offset when both are provided', async () => {
    const result = await getAllMessages(5, 10);
    expect(result).toEqual([]);
  });

  it('TrialSessionWorkingCopy - calls the mapper for each returned record', async () => {
    const mockRecord = { trialSessionId: 'ts1', userId: 'u1' };
    (getDbReader as jest.Mock).mockImplementation((cb: any) =>
      cb(mockBuildFluentChain([mockRecord])),
    );

    const result = await entityValidationFunctions.TrialSessionWorkingCopy();
    expect(result).toEqual([]); // no validation errors
    expect(fromKyselyNewTrialSessionWorkingCopy).toHaveBeenCalledWith(
      mockRecord,
    );
  });

  it('WorkItem - formats elapsed time using minutes when validation takes over 60 seconds', async () => {
    (getCurrentDateTimeInMillis as jest.Mock)
      .mockReturnValueOnce(0) // startTime
      .mockReturnValue(61000); // all subsequent calls → 61s elapsed
    (getDbReader as jest.Mock).mockImplementation((cb: any) =>
      cb(mockBuildFluentChain([{ workItemId: '1' }])),
    );

    await entityValidationFunctions.WorkItem();

    expect(mockSpinner.succeed).toHaveBeenCalledWith(
      expect.stringContaining('1m'),
    );
  });

  // Lines 129-130, 137: getIdleWorker queue and waiter(worker) path.
  // Triggered when more concurrent Case fetch-workers than validation workers.
  // Use 2 CPUs (numThreads=1) + 2001 docket numbers → 3 fetch-workers all racing
  // for the single validation worker → 2 must queue (lines 129-130); each resolved
  // in turn by returnWorker calling waiter(worker) (line 137).
  it('Case - queues workers correctly when concurrent fetches exceed worker count', async () => {
    (os.cpus as jest.Mock).mockReturnValueOnce(
      new Array(2).fill({ model: 'CPU' }),
    ); // numThreads = max(1, 2-1) = 1
    const docketNumbers = Array.from({ length: 2001 }, (_, i) => `${i}-23`);
    (getDbReader as jest.Mock).mockImplementation((cb: any) =>
      cb(mockBuildFluentChain(docketNumbers.map(d => ({ docketNumber: d })))),
    );
    (getCasesByDocketNumbers as jest.Mock).mockResolvedValue([
      { docketNumber: '0-23' },
    ]);

    const result = await entityValidationFunctions.Case();
    expect(result).toEqual([]);
    // 3 batches of 1000 → getCasesByDocketNumbers called 3 times
    expect(getCasesByDocketNumbers).toHaveBeenCalledTimes(3);
  });

  it('getAllMessages - calls fromKyselyMessage mapper for each returned message', async () => {
    const mockMessage = { messageId: 'm1', docketNumber: '1-23' };
    (getDbReader as jest.Mock).mockImplementation((cb: any) =>
      cb(mockBuildFluentChain([mockMessage])),
    );

    await getAllMessages();

    expect(fromKyselyMessage).toHaveBeenCalledWith(mockMessage);
  });

  it('User - calls fromKyselyUser mapper for each returned user', async () => {
    const mockUser = { userId: 'u1' };
    (getDbReader as jest.Mock).mockImplementation((cb: any) =>
      cb(mockBuildFluentChain([mockUser])),
    );

    await entityValidationFunctions.User();

    expect(fromKyselyUser).toHaveBeenCalledWith(mockUser);
  });
});
