import { Case } from '@shared/business/entities/cases/Case';
import { parentPort } from 'worker_threads';

if (!parentPort) {
  throw new Error('This file must be run as a worker thread');
}

parentPort.on('message', (caseItems: any[]) => {
  const errors: string[] = [];

  for (const caseItem of caseItems) {
    const caseEntity = new Case(caseItem, { authorizedUser: undefined });
    const validationErrors = caseEntity.getFormattedValidationErrors();

    if (validationErrors) {
      errors.push(
        `Validation errors for case ${caseItem.docketNumber}: ${validationErrors}`,
      );
    }
  }

  parentPort!.postMessage(errors);
});
