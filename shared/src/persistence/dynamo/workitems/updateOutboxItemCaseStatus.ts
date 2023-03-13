import { update } from '../../dynamodbClientService';

export const updateOutboxItemCaseStatus = ({
  applicationContext,
  caseStatus,
  completedAt,
  section,
}: {
  applicationContext: IApplicationContext;
  caseStatus: string;
  section: string;
  completedAt: string;
}) =>
  update({
    ExpressionAttributeNames: {
      '#caseStatus': 'caseStatus',
    },
    ExpressionAttributeValues: {
      ':caseStatus': caseStatus,
    },
    Key: {
      pk: `section-outbox|${section}`,
      sk: completedAt,
    },
    UpdateExpression: 'SET #caseStatus = :caseStatus',
    applicationContext,
  });
