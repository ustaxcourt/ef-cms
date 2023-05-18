import jwt from 'jsonwebtoken';

export const decodeTokenAction = ({ props }: ActionProps) => {
  const decoded = jwt.decode(props.token);
  decoded.userId = decoded['custom:userId'] || decoded.sub;
  decoded.role = decoded['custom:role'];
  return {
    token: props.token,
    user: decoded,
  };
};
