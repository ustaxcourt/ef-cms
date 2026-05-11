import { put } from '../requests';
import { ClientApplicationContext } from '@web-client/applicationContext';
import { UserContact } from '@shared/business/entities/User';

export const updateUserContactInformationInteractor = (
  applicationContext: ClientApplicationContext,
  {
    contactInfo,
    firmName,
    userId,
    clientConnectionId,
  }: {
    contactInfo: UserContact;
    firmName: string;
    userId: string;
    clientConnectionId: string;
  },
): Promise<void> => {
  return put({
    applicationContext,
    body: { contactInfo, firmName, clientConnectionId },
    endpoint: `/async/users/${userId}/contact-info`,
  });
};
