#!/usr/bin/env -S npx ts-node --transpile-only

import { Case } from '@shared/business/entities/cases/Case';
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

/* VALIDATION FUNCTIONS */
const getTrialSessionsAndValidate = async () => {
  try {
    const trialSessions = await getTrialSessions();
    for (const trialSession of trialSessions) {
      const trialSessionEntity = new TrialSession(trialSession);
      const errors = trialSessionEntity.getFormattedValidationErrors();
      if (errors) {
        console.error(
          `Validation errors for trial session ${trialSession.trialSessionId}:`,
          errors,
        );
      }
    }
    console.log('All trial session entities validated!');
  } catch (error) {
    console.error('Error getting trial sessions:', error);
  }
};

const getMessagesAndValidate = async () => {
  try {
    const messages = await getAllMessages();
    for (const message of messages) {
      const messageEntity = new Message(message);
      const errors = messageEntity.getFormattedValidationErrors();
      if (errors) {
        console.error(
          `Validation errors for message ${message.messageId}:`,
          errors,
        );
      }
    }
    console.log('All message entities validated!');
  } catch (error) {
    console.error('Error getting messages:', error);
  }
};

const getWorkItemsAndValidate = async () => {
  try {
    const workItems = await getAllWorkItems();
    for (const workItem of workItems) {
      const workItemEntity = new WorkItem(workItem);
      const errors = workItemEntity.getFormattedValidationErrors();
      if (errors) {
        console.error(
          `Validation errors for work item ${workItem.workItemId}:`,
          errors,
        );
      }
    }
    console.log('All work item entities validated!');
  } catch (error) {
    console.error('Error getting work items:', error);
  }
};

const getCasesAndValidate = async () => {
  try {
    const docketNumbers = await getAllDocketNumbers();

    const chunkSize = 10000;
    for (let i = 0; i < docketNumbers.length; i += chunkSize) {
      const chunk = docketNumbers.slice(i, i + chunkSize);
      // do whatever
      const caseData = await getCasesByDocketNumbers({ docketNumbers: chunk });

      caseData.forEach(caseItem => {
        const caseEntity = new Case(caseItem, { authorizedUser: undefined });
        const errors = caseEntity.getFormattedValidationErrors();
        if (errors) {
          console.error(
            `Validation errors for case ${caseItem.docketNumber}:`,
            errors,
          );
        }
      });
      console.log(`Processed cases ${i + 1} - ${i + chunkSize}`);
    }
  } catch (error) {
    console.error('Error getting cases:', error);
  }
};

const getTrialSessionWorkingCopiesAndValidate = async () => {
  try {
    const workingCopies = await getAllTrialSessionWorkingCopies();
    for (const workingCopy of workingCopies) {
      const workingCopyEntity = new TrialSessionWorkingCopy(workingCopy);
      const errors = workingCopyEntity.getFormattedValidationErrors();
      if (errors) {
        console.error(
          `Validation errors for trial session working copy ${workingCopy.trialSessionId} and user ${workingCopy.userId}:`,
          errors,
        );
      }
    }
    console.log('All trial session working copy entities validated!');
  } catch (error) {
    console.error('Error getting trial session working copies:', error);
  }
};

const getUsersAndValidate = async () => {
  try {
    const users = await getAllUsers();
    for (const user of users) {
      const userEntity = new User(user);
      const errors = userEntity.getFormattedValidationErrors();
      if (errors) {
        console.error(`Validation errors for user ${user.userId}:`, errors);
      }
    }
    console.log('All user entities validated!');
  } catch (error) {
    console.error('Error getting users:', error);
  }
};

const getPractitionerDocumentsAndValidate = async () => {
  try {
    const practitionerDocuments = await getAllPractionerDocuments();
    for (const practitionerDocument of practitionerDocuments) {
      // Assuming you have a PractitionerDocument entity similar to Case and TrialSession
      const practitionerDocumentItem = new PractitionerDocument(
        practitionerDocument,
        { applicationContext: undefined },
      );
      const errors = practitionerDocumentItem.getFormattedValidationErrors();
      if (errors) {
        console.error(
          `Validation errors for practioner document ${practitionerDocumentItem.practitionerDocumentFileId}`,
          errors,
        );
      }
    }
    console.log('All practitioner document entities validated!');
  } catch (error) {
    console.error('Error getting practitioner documents:', error);
  }
};

void (async () => {
  await getTrialSessionsAndValidate();
  await getCasesAndValidate();
  await getMessagesAndValidate();
  await getWorkItemsAndValidate();
  await getUsersAndValidate();
  await getTrialSessionWorkingCopiesAndValidate();
  await getPractitionerDocumentsAndValidate();
})();
