import { omit } from 'lodash';
import { put } from '../../dynamodbClientService';

export const fieldsToOmitBeforePersisting = [
  'archivedCorrespondences',
  'archivedDocketEntries',
  'consolidatedCases',
  'correspondence',
  'docketEntries',
  'hearings',
  'irsPractitioners',
  'privatePractitioners',
] as const;

/**
 * createCase -- should usually be called via createCaseAndAssociations use-case helper.
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
  caseToCreate: Case;
}) =>
  put({
    Item: {
      ...omit(caseToCreate, fieldsToOmitBeforePersisting),
      pk: `case|${caseToCreate.docketNumber}`,
      sk: `case|${caseToCreate.docketNumber}`,
    },
    applicationContext,
  });
