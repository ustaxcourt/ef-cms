#!/usr/bin/env -S npx ts-node --transpile-only

import { Case } from '@shared/business/entities/cases/Case';
import { JoiValidationEntity } from '@shared/business/entities/JoiValidationEntity';
import { Message } from '@shared/business/entities/Message';
import { PractitionerDocument } from '@shared/business/entities/PractitionerDocument';
import { TrialSession } from '@shared/business/entities/trialSessions/TrialSession';
import { TrialSessionWorkingCopy } from '@shared/business/entities/trialSessions/TrialSessionWorkingCopy';
import { User } from '@shared/business/entities/User';
import { WorkItem } from '@shared/business/entities/WorkItem';
import { getDbReader } from '@web-api/database';
import { getCasesByDocketNumbers } from '@web-api/persistence/postgres/cases/getCasesByDocketNumbers';
import { fromKyselyMessage } from '@web-api/persistence/postgres/messages/mapper';
import { getTrialSessions } from '@web-api/persistence/postgres/trialSessions/getTrialSessions';
import { fromKyselyNewTrialSessionWorkingCopy } from '@web-api/persistence/postgres/trialSessions/mapper';
import { fromKyselyUser } from '@web-api/persistence/postgres/users/mapper';
import { fromKyselyWorkItem } from '@web-api/persistence/postgres/workitems/mapper';
import { camelCase } from 'lodash';
import { createSpinner } from 'scripts/helpers/consoleSpinner';

/* HELPERS */
const getAllDocketNumbers = async () => {
  return getDbReader(async reader => {
    return (
      await reader.selectFrom('dwCase').select('docketNumber').execute()
    ).map(record => record.docketNumber);
  });
};

const getAllMessages = async (limit?: number, offset?: number) => {
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

const getAllTrialSessionWorkingCopies = async () => {
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

const getAllPractionerDocuments = async () => {
  const practitionerDocuments = await getDbReader(async reader => {
    return await reader
      .selectFrom('dwPractitionerDocuments')
      .selectAll()
      .execute();
  });

  return practitionerDocuments;
};

const entityHelperFunctions = {
  // Case: getCasesAndValidate,
  Message: getAllMessages,
  PractitionerDocument: getAllPractionerDocuments,
  TrialSession: getTrialSessions,
  TrialSessionWorkingCopy: getAllTrialSessionWorkingCopies,
  User: getAllUsers,
  WorkItem: getAllWorkItems,
};

const mapEntityNameToClass = (
  entityName: string,
  record,
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

const performValidation = async (entityName: string) => {
  const spinner = createSpinner(`Starting ${entityName} Entity Validation...`);
  const validationErrors: string[] = [];
  try {
    const entityRecords = await entityHelperFunctions[entityName]();
    for (const record of entityRecords) {
      const entity = mapEntityNameToClass(entityName, record);
      const errors = entity.getFormattedValidationErrors();
      if (errors) {
        spinner.update(
          `Validating ${entityName} entities, ${validationErrors.length} error(s) found out of ${entityRecords.length} records...`,
        );
        validationErrors.push(
          `Validation errors for ${entityName} ${record[`${camelCase(entityName)}Id`]}: ${JSON.stringify(errors)}`,
        );
      }
    }
    if (validationErrors.length > 0) {
      spinner.fail(
        `Validation completed with ${validationErrors.length} error(s) found out of ${entityRecords.length} records.`,
      );
      console.log(validationErrors);
    } else {
      spinner.succeed(`All ${entityName} entities validated!`);
    }
  } catch (error) {
    console.error(`Error getting ${entityName} entities:`, error);
  }

  return validationErrors;
};

/* VALIDATION FUNCTIONS */
const getTrialSessionsAndValidate = async () => {
  return performValidation('TrialSession');
};

const getMessagesAndValidate = async () => {
  return performValidation('Message');
};

const getWorkItemsAndValidate = async () => {
  return performValidation('WorkItem');
};

const getCasesAndValidate = async () => {
  const validationErrors: string[] = [];
  try {
    console.log('Starting Case Entity Validation...');
    const docketNumbers = await getAllDocketNumbers();

    const chunkSize = 10000;
    for (let i = 0; i < docketNumbers.length; i += chunkSize) {
      const spinner = createSpinner(
        `Starting validation of cases ${i}-${i + chunkSize}...`,
      );
      const chunk = docketNumbers.slice(i, i + chunkSize);
      // do whatever
      const caseData = await getCasesByDocketNumbers({ docketNumbers: chunk });

      caseData.forEach(caseItem => {
        const caseEntity = new Case(caseItem, { authorizedUser: undefined });
        const errors = caseEntity.getFormattedValidationErrors();
        if (errors) {
          validationErrors.push(
            `Validation errors for case ${caseItem.docketNumber}: ${errors}`,
          );
          spinner.update(
            `Starting validation of cases ${i * chunkSize}-${(i + 1) * chunkSize}. ${validationErrors.length} errors found...`,
          );
        }
      });
      // console.log(`Processed cases ${i + 1} - ${i + chunkSize}`);
      spinner.succeed(`Processed cases ${i + 1} - ${i + chunkSize}`);
    }
  } catch (error) {
    console.error('Error getting cases:', error);
  }
  return validationErrors;
};

const getTrialSessionWorkingCopiesAndValidate = async () => {
  return performValidation('TrialSessionWorkingCopy');
};

const getUsersAndValidate = async () => {
  return performValidation('User');
};

const getPractitionerDocumentsAndValidate = async () => {
  return performValidation('PractitionerDocument');
};

export const entityValidationFunctions = {
  Case: getCasesAndValidate,
  Message: getMessagesAndValidate,
  PractitionerDocument: getPractitionerDocumentsAndValidate,
  TrialSession: getTrialSessionsAndValidate,
  TrialSessionWorkingCopy: getTrialSessionWorkingCopiesAndValidate,
  User: getUsersAndValidate,
  WorkItem: getWorkItemsAndValidate,
};

// void (async () => {
//   await getTrialSessionsAndValidate();
//   await getCasesAndValidate();
//   await getMessagesAndValidate();
//   await getWorkItemsAndValidate();
//   await getUsersAndValidate();
//   await getTrialSessionWorkingCopiesAndValidate();
//   await getPractitionerDocumentsAndValidate();
// })();
