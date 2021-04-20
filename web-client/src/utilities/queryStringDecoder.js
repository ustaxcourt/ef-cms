import qs from 'qs';

export const queryStringDecoder = () => {
  const query = qs.parse((window.location.search || '').substring(1));
  const hash = qs.parse((window.location.hash || '').substring(1)); // cognito uses a # instead of ?
  const { code } = query;
  const token = hash.id_token || query.token;
  const path = query.path || '/';

  return {
    code,
    path,
    token,
  };
};
