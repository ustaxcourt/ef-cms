import { TransactionBuilder } from '../createTransaction';
import { fieldsToOmitBeforePersisting } from './createCase';
import { omit } from 'lodash';
import { put } from '../../dynamodbClientService';

/**
 * updateCase
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.caseToUpdate the case data to update
 * @returns {Promise} the promise of the persistence calls
 */
export const updateCase = async ({
  applicationContext,
  caseToUpdate,
  transaction,
}: {
  applicationContext: IApplicationContext;
  caseToUpdate: TCase;
  transaction?: TransactionBuilder;
}) => {
  const setLeadCase = caseToUpdate.leadDocketNumber
    ? { gsi1pk: `case|${caseToUpdate.leadDocketNumber}` }
    : {};

  await put({
    Item: {
      ...setLeadCase,
      ...omit(caseToUpdate, fieldsToOmitBeforePersisting),
      pk: `case|${caseToUpdate.docketNumber}`,
      sk: `case|${caseToUpdate.docketNumber}`,
    },
    applicationContext,
    transaction,
  });

  return caseToUpdate;
};
