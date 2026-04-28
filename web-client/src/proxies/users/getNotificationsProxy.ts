import { get } from '../requests';
import qs from 'qs';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const getNotificationsInteractor = (
  applicationContext: ClientApplicationContext,
  { judgeId, section, selectedSection },
) => {
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
