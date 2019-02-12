import { state } from 'cerebral';
import jwt from 'jsonwebtoken';

export default ({ props, store }) => {
  const token = jwt.decode(props.token);

  console.log('decoded token', token)
  return { username: token.email, ...token };
  // store.set(state.user, user);
}
