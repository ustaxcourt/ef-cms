import { ActionError } from '../errors/ActionError';
import { state } from 'cerebral';
import { userMap } from '../../../../shared/src/test/mockUserTokenMap';
import jwt from 'jsonwebtoken';

/**
 * this is used for creating a jwt token to login locally only
 *
 * @param {object} providers the providers object
 * @param {Function} providers.get the cerebral get function
 * @param {object} providers.props the cerebral props object
 * @returns {object} the jwt token
 */
export const createTokenAction = async ({ get, props }) => {
  const name = props.token || get(state.form.name);
  if (!userMap[name]) {
    throw new ActionError('Username not found in mock logins.');
  }
  const user = {
    ...userMap[name],
    sub: userMap[name].userId,
  };
  return {
    token: jwt.sign(user, 'secret'),
  };
};
