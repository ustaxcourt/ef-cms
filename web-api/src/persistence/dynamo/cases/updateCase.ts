import { fieldsToOmitBeforePersisting } from './createCase';
import { omit } from 'lodash';
import { put } from '../../dynamodbClientService';

export const updateCase = async ({
  applicationContext,
  caseToUpdate,
}: {
  applicationContext: IApplicationContext;
  caseToUpdate: RawCase;
}): Promise<RawCase> => {
  const setLeadCase = caseToUpdate.leadDocketNumber
    ? { gsi1pk: `leadCase|${caseToUpdate.leadDocketNumber}` }
    : {};

  await put({
    Item: {
      ...setLeadCase,
      ...omit(caseToUpdate, fieldsToOmitBeforePersisting),
      pk: `case|${caseToUpdate.docketNumber}`,
      sk: `case|${caseToUpdate.docketNumber}`,
    },
    applicationContext,
  });

  return caseToUpdate;
};
