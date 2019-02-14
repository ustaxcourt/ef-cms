import jwt from 'jsonwebtoken';

export default ({ props }) => {
  const decoded = jwt.decode(props.token);
  decoded.userId = decoded.email;
  decoded.role = decoded['custom:role'];
  return {
    user: decoded ? decoded : props.token, // TODO remove ternary
    token: decoded ? props.token : undefined, // TODO remove ternary
  };
};
