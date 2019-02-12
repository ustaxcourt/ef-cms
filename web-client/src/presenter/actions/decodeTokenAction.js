import { state } from 'cerebral';
import jwt from 'jsonwebtoken';

export default ({ applicationContext, props, store }) => {
  const decoded = jwt.decode(props.token);
  return {
    userId: decoded ? decoded.email : props.token,
  }
}
