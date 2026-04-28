import { put } from '../requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const updateUserContactInformationInteractor = (
  applicationContext: ClientApplicationContext,
  {
    contactInfo,
    firmName,
    userId,
    clientConnectionId,
  }: {
    contactInfo: any;
    firmName: string;
    userId: string;
    clientConnectionId: string;
  },
) => {
  return put({
    applicationContext,
    body: { contactInfo, firmName, clientConnectionId },
    endpoint: `/async/users/${userId}/contact-info`,
  });
};
