import { ActionError } from '../errors/ActionError';
import { state } from 'cerebral';
import jwt from 'jsonwebtoken';

import { userMap } from '../../../../shared/src/persistence/dynamo/users/getUserById';

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
