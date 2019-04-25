import { Auth } from 'aws-amplify';
import { state } from 'cerebral';

/**
 * Fetches the case using the getCase use case using the state.caseDetail.docketNumber
 * and sets state.caseDetail to the returned caseDetail
 *
 * @param {Object} providers the providers object
 * @param {Object} providers.applicationContext needed for getting the getCase use case
 * @param {Function} providers.get the cerebral get function used for getting state.user.token
 * @param {Object} providers.store the cerebral store function used to set state.caseDetail
 */
export const refreshTokenAction = async ({
  applicationContext,
  get,
  store,
}) => {
  const cognitoUser = await Auth.currentAuthenticatedUser();
  const currentSession = await Auth.currentSession();
  return new Promise((resolve, reject) => {
    cognitoUser.refreshSession(currentSession.refreshToken, (err, session) => {
      console.log('session', err, session);
      const { idToken, refreshToken, accessToken } = session;
      if (err) reject(err);
      resolve({
        token: idToken,
      });
    });
  });
};
