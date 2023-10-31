import { RawCaseDeadline } from '@shared/business/entities/CaseDeadline';
import { put } from '../../dynamodbClientService';

export const createCaseDeadline = ({
  applicationContext,
  caseDeadline,
}: {
  applicationContext: IApplicationContext;
  caseDeadline: RawCaseDeadline;
}) => {
  const { caseDeadlineId, docketNumber } = caseDeadline;
  return Promise.all([
    put({
      Item: {
        ...caseDeadline,
        pk: `case-deadline|${caseDeadlineId}`,
        sk: `case-deadline|${caseDeadlineId}`,
      },
      applicationContext,
    }),
    put({
      Item: {
        pk: `case|${docketNumber}`,
        sk: `case-deadline|${caseDeadlineId}`,
      },
      applicationContext,
    }),
  ]);
};
