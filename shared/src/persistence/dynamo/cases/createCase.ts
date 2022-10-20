import { put } from '../../dynamodbClientService';
import { omit } from 'lodash';

export const fieldsToOmitBeforePersisting = [
  'archivedCorrespondences',
  'archivedDocketEntries',
  'correspondence',
  'docketEntries',
  'hearings',
  'irsPractitioners',
  'privatePractitioners',
];

/**
 * createCase -- should usually be called via createCaseAndAssociations use-case helper.
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.caseToCreate the case data
 * @returns {object} the case data
 */
export const createCase = ({
  applicationContext,
  caseToCreate,
}: {
  applicationContext: IApplicationContext;
  caseToCreate: TCase;
}) =>
  put({
    Item: {
      ...omit(caseToCreate, fieldsToOmitBeforePersisting),
      pk: `case|${caseToCreate.docketNumber}`,
      sk: `case|${caseToCreate.docketNumber}`,
    },
    applicationContext,
  });
