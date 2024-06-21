import { WorkItemBox } from '@web-api/business/useCases/workItems/getDocumentQCForUserInteractor';
import { get } from '../requests';

export type UserGroup = 'user' | 'section';

export type Recipient = {
  group: UserGroup;
  identifier: string;
};

export const getDocumentQCInteractor = (
  applicationContext,
  {
    box,
    judgeUser,
    recipient,
  }: {
    recipient: Recipient;
    judgeUser?: { name: string };
    box: WorkItemBox;
  },
) => {
  const prefix = recipient.group === 'user' ? 'users' : 'sections';

  const queryParams =
    judgeUser && judgeUser.name ? { judgeUserName: judgeUser.name } : {};

  return get({
    applicationContext,
    endpoint: `/${prefix}/${recipient.identifier}/document-qc/${box}`,
    params: queryParams,
  });
};
