import jwt from 'jsonwebtoken';
import { state } from 'cerebral';

import { userMap } from '../../../../shared/src/persistence/dynamo/users/getUserById';

export const createTokenAction = async ({ get, props }) => {
  const name = props.token || get(state.form.name);
  const user = userMap[name];
  return {
    token: jwt.sign(user, 'secret'),
  };
};
