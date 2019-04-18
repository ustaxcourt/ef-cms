import { state } from 'cerebral';
import jwt from 'jsonwebtoken';

import { userMap } from '../../../../shared/src/persistence/dynamo/users/getUserById';

export const createTokenAction = async ({ get, props }) => {
  const name = props.token || get(state.form.name);
  const user = {
    ...userMap[name],
    sub: userMap[name].userId,
  };
  return {
    token: jwt.sign(user, 'secret'),
  };
};
