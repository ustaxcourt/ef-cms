import { Case } from '@shared/business/entities/cases/Case';
import { JoiValidationEntity } from '@shared/business/entities/JoiValidationEntity';
import { Message } from '@shared/business/entities/Message';
import { PractitionerDocument } from '@shared/business/entities/PractitionerDocument';
import { TrialSession } from '@shared/business/entities/trialSessions/TrialSession';
import { TrialSessionWorkingCopy } from '@shared/business/entities/trialSessions/TrialSessionWorkingCopy';
import { User } from '@shared/business/entities/User';
import { WorkItem } from '@shared/business/entities/WorkItem';
import { parentPort } from 'worker_threads';
import { camelCase } from 'lodash';

if (!parentPort) {
  throw new Error('This file must be run as a worker thread');
}

const mapEntityNameToClass = (
  entityName: string,
  record: any,
): JoiValidationEntity => {
  switch (entityName) {
    case 'Case':
      return new Case(record, { authorizedUser: undefined });
    case 'Message':
      return new Message(record);
    case 'PractitionerDocument':
      return new PractitionerDocument(record, {
        applicationContext: undefined,
      });
    case 'TrialSession':
      return new TrialSession(record);
    case 'TrialSessionWorkingCopy':
      return new TrialSessionWorkingCopy(record);
    case 'User':
      return new User(record);
    case 'WorkItem':
      return new WorkItem(record);
    default:
      throw new Error(`Unknown entity name: ${entityName}`);
  }
};

parentPort.on(
  'message',
  ({ entityName, records }: { entityName: string; records: any[] }) => {
    const errors: string[] = [];

    for (const record of records) {
      const entity = mapEntityNameToClass(entityName, record);
      const validationErrors = entity.getFormattedValidationErrors();

      if (validationErrors) {
        if (entityName === 'Case') {
          errors.push(
            `Validation errors for ${entityName} ${record.docketNumber}: ${JSON.stringify(validationErrors)}`,
          );
        } else {
          const idField = `${camelCase(entityName)}Id`;
          errors.push(
            `Validation errors for ${entityName} ${record[idField]}: ${JSON.stringify(validationErrors)}`,
          );
        }
      }
    }

    parentPort!.postMessage(errors);
  },
);
