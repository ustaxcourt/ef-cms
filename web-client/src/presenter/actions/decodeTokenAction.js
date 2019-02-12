import jwt from 'jsonwebtoken';

export default ({ props }) => {
  const decoded = jwt.decode(props.token);
  return {
    userId: decoded ? decoded.email : props.token,
    token: decoded ? props.token : undefined,
  };
};
