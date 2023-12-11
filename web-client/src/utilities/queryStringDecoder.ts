import qs from 'qs';

export const queryStringDecoder = () => {
  //TODO: 10007 clean me up!
  const query = qs.parse((window.location.search || '').substring(1));
  const hash = qs.parse((window.location.hash || '').substring(1)); // cognito uses a # instead of ?
  const { code } = query;
  const token = hash.id_token || query.token;
  const { refreshToken } = query;
  const path = query.path || '/';

  return {
    code,
    path,
    refreshToken,
    token,
  };
};
