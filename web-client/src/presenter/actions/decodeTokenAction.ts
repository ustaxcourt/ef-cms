import jwt from 'jsonwebtoken';

export const decodeTokenAction = ({
  props,
}: ActionProps<{
  accessToken: string;
  idToken: string;
  refreshToken: string;
}>) => {
  const decoded = jwt.decode(props.idToken);

  decoded.userId = decoded['custom:userId'] || decoded.sub;
  decoded.role = decoded['custom:role'];

  return {
    user: decoded,
  };
};
