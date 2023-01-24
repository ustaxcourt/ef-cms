import { get } from '../../dynamodbClientService';

/**
 * getDocketEntry
 * gets the full case when contents are under 400 kb
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.docketNumber the docket number to get
 * @returns {object} the case details
 */
export const getDocketEntry = ({
  applicationContext,
  docketEntryId,
  docketNumber,
}: {
  applicationContext: IApplicationContext;
  docketEntryId: string;
  docketNumber: string;
}) => {
  return get({
    Key: {
      pk: `case|${docketNumber}`,
      sk: `docket-entry|${docketEntryId}`,
    },
    applicationContext,
  });
};
