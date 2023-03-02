import { fieldsToOmitBeforePersisting } from './createCase';
import { omit } from 'lodash';
import { put, update } from '../../dynamodbClientService';

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
}: {
  applicationContext: IApplicationContext;
  caseToUpdate: TCase;
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
  });

  return caseToUpdate;
};

export const updateCaseV2 = async ({
  applicationContext,
  caseToUpdate,
  diff,
}: {
  applicationContext: IApplicationContext;
  caseToUpdate: TCase;
  diff: any;
}) => {
  applicationContext.logger.debug('update case v2 init', { diff });

  diff = omit(diff, fieldsToOmitBeforePersisting);
  // diff = {
  //   automaticBlockedDate: '2023-03-02T21:30:58.178Z',
  // };

  const ExpressionAttributeValues = {
    ':pk': { S: `case|${caseToUpdate.docketNumber}` },
  };

  const ExpressionAttributeNames = {
    '#pk': 'pk',
    '#sk': 'sk',
  };

  Object.keys(diff).forEach(key => {
    ExpressionAttributeValues[`:${key}`] = { S: diff[key] };
    ExpressionAttributeNames[`#${key}`] = key;
  });

  const UpdateExpression = Object.keys(diff)
    .map(key => `#${key} = :#${key}`)
    .join(' ');

  applicationContext.logger.debug('update case v2', {
    ExpressionAttributeNames,
    ExpressionAttributeValues,
    UpdateExpression,
    diff,
  });

  return caseToUpdate;

  await update({
    ExpressionAttributeNames,
    ExpressionAttributeValues,
    KeyConditionExpression: '#pk = :pk AND #sk = :pk',
    UpdateExpression: 'SET ${UpdateExpression}',
    applicationContext,
  });

  return caseToUpdate;
};
