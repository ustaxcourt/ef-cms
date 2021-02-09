import { ActionError } from '../errors/ActionError';
import { state } from 'cerebral';
import { userMap } from '../../../../shared/src/test/mockUserTokenMap';
import jwt from 'jsonwebtoken';

/**
 * this is used for creating a jwt token to login locally only
 *
 * @param {object} providers the providers object
 * @param {Function} providers.applicationContext the application context
 * @param {Function} providers.get the cerebral get function
 * @param {object} providers.props the cerebral props object
 * @returns {object} the jwt token
 */
export const createTokenAction = ({ applicationContext, get, props }) => {
  const name = props.token || get(state.form.name);
  if (!userMap[name]) {
    throw new ActionError(`Username "${name}" not found in mock logins.`);
  }

  const { USER_ROLES } = applicationContext.getConstants();

  if (userMap[name].role === USER_ROLES.legacyJudge) {
    throw new ActionError(`The legacy judge "${name}" cannot login.`);
  }

  const user = {
    ...userMap[name],
    sub: userMap[name].userId,
  };
  return {
    token: jwt.sign(user, 'secret'),
  };
};
