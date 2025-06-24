import { put } from '../requests';

/**
 * updatePractitionerContactInformationInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.contactInfo the contactInfo to update the contact info
 * @param {string} providers.firmName an optional firmName if a privatePractitioner is updating their info
 * @param {string} providers.userId the userId to update the contact info
 * @returns {Promise<*>} the promise of the api call
 */
export const updatePractitionerContactInformationInteractor = (
  applicationContext,
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
