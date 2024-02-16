import { get } from '../requests';

/**
 * getDocumentQCInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.userId the user to get the document qc
 * @returns {Promise<*>} the promise of the api call
 */
export const getDocumentQCInteractor = (
  applicationContext,
  {
    box,
    judgeUser,
    recipient,
  }: {
    recipient: {
      group: 'user' | 'section';
      identifier: string;
    };
    judgeUser?: { name: string };
    box: 'inbox' | 'inProgress' | 'served';
  },
) => {
  let prefix = recipient.group === 'user' ? 'users' : 'sections';

  const queryParams =
    judgeUser && judgeUser.name ? { judgeUserName: judgeUser.name } : {};

  return get({
    applicationContext,
    endpoint: `/${prefix}/${recipient.identifier}/document-qc/${box}`,
    params: queryParams,
  });
};
