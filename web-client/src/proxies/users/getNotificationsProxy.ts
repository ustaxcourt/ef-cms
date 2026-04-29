import { get } from '../requests';
import qs from 'qs';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const getNotificationsInteractor = (
  applicationContext: ClientApplicationContext,
  { judgeId, section, selectedSection },
): Promise<{
  qcIndividualInProgressCount: number;
  qcIndividualInboxCount: number;
  qcSectionInProgressCount: number;
  qcSectionInboxCount: number;
  qcUnreadCount: number;
  unreadMessageCount: number;
  userInboxCount: number;
  userSectionCount: number;
}> => {
  const queryString = qs.stringify({
    judgeId,
    section,
    selectedSection,
  });

  return get({
    applicationContext,
    endpoint: `/api/notifications?${queryString}`,
  });
};
