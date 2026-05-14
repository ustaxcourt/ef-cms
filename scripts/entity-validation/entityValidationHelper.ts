#!/usr/bin/env -S npx ts-node --transpile-only

import { Worker } from 'worker_threads';
import { getDbReader } from '@web-api/persistence/postgres/database';
import { getCasesByDocketNumbers } from '@web-api/persistence/postgres/cases/getCasesByDocketNumbers';
import { fromKyselyMessage } from '@web-api/persistence/postgres/messages/mapper';
import { getTrialSessions } from '@web-api/persistence/postgres/trialSessions/getTrialSessions';
import { fromKyselyNewTrialSessionWorkingCopy } from '@web-api/persistence/postgres/trialSessions/mapper';
import { fromKyselyUser } from '@web-api/persistence/postgres/users/mapper';
import { fromKyselyWorkItem } from '@web-api/persistence/postgres/workitems/mapper';
import { getCurrentDateTimeInMillis } from '@shared/business/utilities/DateHandler';
import { createSpinner } from '../helpers/consoleSpinner';
import os from 'os';
import path from 'path';

/* HELPERS */
const getAllDocketNumbers = () => {
  return getDbReader(async reader => {
    return (
      await reader.selectFrom('dwCase').select('docketNumber').execute()
    ).map(record => record.docketNumber);
  });
};

export const getAllMessages = async (limit?: number, offset?: number) => {
  const messages = await getDbReader(async reader => {
    let query = reader
      .selectFrom('dwMessage as m')
      .leftJoin('dwCase as c', 'c.docketNumber', 'm.docketNumber')
      .selectAll('m')
      .select([
        'c.status',
        'c.trialDate',
        'c.trialLocation',
        'c.docketNumberSuffix',
        'c.leadDocketNumber',
        'c.caption',
      ])
      .orderBy('messageId', 'desc');
    if (limit !== undefined) {
      query = query.limit(limit);
    }
    if (offset !== undefined) {
      query = query.offset(offset);
    }

    return await query.execute();
  });

  return messages.map(message => fromKyselyMessage(message));
};

const getAllWorkItems = async () => {
  const workItems = await getDbReader(async reader => {
    return await reader.selectFrom('dwWorkItem').selectAll().execute();
  });

  return workItems.map(workItem => fromKyselyWorkItem(workItem));
};

const getAllTrialSessionWorkingCopies = () => {
  return getDbReader(async reader => {
    return (
      await reader.selectFrom('dwTrialSessionWorkingCopy').selectAll().execute()
    ).map(record => fromKyselyNewTrialSessionWorkingCopy(record));
  });
};

const getAllUsers = async () => {
  const users = await getDbReader(async reader => {
    return await reader.selectFrom('dwUser').selectAll().execute();
  });

  return users.map(user => fromKyselyUser(user));
};

const getAllPractitionerDocuments = async () => {
  const practitionerDocuments = await getDbReader(async reader => {
    return await reader
      .selectFrom('dwPractitionerDocuments')
      .selectAll()
      .execute();
  });

  return practitionerDocuments;
};

const formatElapsedTime = (startTime: number) => {
  const elapsedMs = getCurrentDateTimeInMillis() - startTime;
  const totalSeconds = Math.floor(elapsedMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  if (minutes === 0) {
    return `${seconds}s`;
  }

  return `${minutes}m ${seconds}s`;
};

const entityHelperFunctions = {
  Message: getAllMessages,
  PractitionerDocument: getAllPractitionerDocuments,
  TrialSession: getTrialSessions,
  TrialSessionWorkingCopy: getAllTrialSessionWorkingCopies,
  User: getAllUsers,
  WorkItem: getAllWorkItems,
};

const performValidation = async (entityName: string) => {
  const startTime = getCurrentDateTimeInMillis();
  const spinner = createSpinner(`Starting ${entityName} Entity Validation...`);
  const validationErrors: string[] = [];
  const numThreads = Math.max(1, os.cpus().length - 1);

  try {
    const workers = Array.from({ length: numThreads }, () =>
      createValidationWorker(),
    );
    const idleWorkers: Worker[] = [...workers];
    const workerWaiters: ((worker: Worker) => void)[] = [];
    const pendingValidations: Promise<void>[] = [];
    let processedRecords = 0;
    let totalRecords = 0;

    const getIdleWorker = (): Promise<Worker> => {
      const idle = idleWorkers.pop();
      if (idle) return Promise.resolve(idle);
      return new Promise<Worker>(resolve => {
        workerWaiters.push(resolve);
      });
    };

    const returnWorker = (worker: Worker) => {
      const waiter = workerWaiters.shift();
      if (waiter) {
        waiter(worker);
      } else {
        idleWorkers.push(worker);
      }
    };

    const dispatchBatch = async (batch: any[]) => {
      const worker = await getIdleWorker();
      const validationPromise = validateBatchInWorker(worker, entityName, batch)
        .then(errors => {
          validationErrors.push(...errors);
          processedRecords += batch.length;
          spinner.update(
            `Validated ${processedRecords} of ${totalRecords} ${entityName} entities in ${formatElapsedTime(startTime)}. ${validationErrors.length} error(s) found...`,
          );
          returnWorker(worker);
        })
        .catch(err => {
          console.error(`Worker error for ${entityName}:`, err);
          returnWorker(worker);
          throw err;
        });
      pendingValidations.push(validationPromise);
    };

    if (entityName === 'Case') {
      // Cases are too large to load at once — fetch in batches
      const docketNumbers = await getAllDocketNumbers();
      totalRecords = docketNumbers.length;
      const fetchBatchSize = 1000;
      const maxConcurrentFetches = 5;

      let nextBatchIndex = 0;
      const totalBatches = Math.ceil(docketNumbers.length / fetchBatchSize);

      const fetchWorker = async () => {
        while (nextBatchIndex < totalBatches) {
          const batchIndex = nextBatchIndex++;
          const start = batchIndex * fetchBatchSize;
          const chunk = docketNumbers.slice(start, start + fetchBatchSize);

          const caseData = await getCasesByDocketNumbers({
            docketNumbers: chunk,
          });

          await dispatchBatch(caseData);
        }
      };

      const fetchWorkerPromises = Array.from(
        { length: Math.min(maxConcurrentFetches, totalBatches) },
        () => fetchWorker(),
      );
      await Promise.all(fetchWorkerPromises);
    } else {
      // Other entities: load all records, split across threads
      const entityRecords = await entityHelperFunctions[entityName]();
      totalRecords = entityRecords.length;
      const batchSize = Math.max(
        1,
        Math.ceil(entityRecords.length / numThreads),
      );

      for (let i = 0; i < entityRecords.length; i += batchSize) {
        const batch = entityRecords.slice(i, i + batchSize);
        await dispatchBatch(batch);
      }
    }

    await Promise.all(pendingValidations);
    await Promise.all(workers.map(w => w.terminate()));

    if (validationErrors.length > 0) {
      spinner.fail(
        `${entityName} validation completed in ${formatElapsedTime(startTime)} with ${validationErrors.length} error(s) found out of ${totalRecords} records.`,
      );
      console.log(
        `${entityName} validation runtime: ${formatElapsedTime(startTime)}`,
      );
      console.log(validationErrors);
    } else {
      spinner.succeed(
        `All ${totalRecords} ${entityName} entities validated in ${formatElapsedTime(startTime)}!`,
      );
      console.log(
        `${entityName} validation runtime: ${formatElapsedTime(startTime)}`,
      );
    }
  } catch (error) {
    console.error(`Error getting ${entityName} entities:`, error);
    console.error(
      `${entityName} validation stopped after ${formatElapsedTime(startTime)}.`,
    );
    throw error;
  }

  return validationErrors;
};

const ENTITY_WORKER_PATH = path.resolve(
  __dirname,
  'workers/entityValidationWorker.ts',
);

const createValidationWorker = (): Worker => {
  return new Worker(ENTITY_WORKER_PATH, {
    execArgv: [
      '--require',
      'ts-node/register/transpile-only',
      '--require',
      'tsconfig-paths/register',
    ],
  });
};

const validateBatchInWorker = (
  worker: Worker,
  entityName: string,
  records: any[],
): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    const onMessage = (data: string[]) => {
      worker.removeListener('error', onError);
      resolve(data);
    };
    const onError = (err: Error) => {
      worker.removeListener('message', onMessage);
      reject(err);
    };
    worker.once('message', onMessage);
    worker.once('error', onError);
    worker.postMessage({ entityName, records });
  });
};

export const entityValidationFunctions = {
  Case: () => performValidation('Case'),
  Message: () => performValidation('Message'),
  PractitionerDocument: () => performValidation('PractitionerDocument'),
  TrialSession: () => performValidation('TrialSession'),
  TrialSessionWorkingCopy: () => performValidation('TrialSessionWorkingCopy'),
  User: () => performValidation('User'),
  WorkItem: () => performValidation('WorkItem'),
};
