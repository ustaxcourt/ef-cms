export const cognitoInboundFederationLambdaHandler = event => {
  console.log('inbound federation event: ', event);

  const { attributes } = event.request;
  const idpAttributes = {
    ...(attributes.userInfo || {}),
    ...(attributes.idToken || {}),
  };
  const userAttributes = {};

  for (const [key, value] of Object.entries(idpAttributes)) {
    if (key === 'email' && typeof value === 'string') {
      userAttributes[key] = value.toLowerCase();
    } else {
      userAttributes[key] = value;
    }
  }

  event.response = { userAttributesToMap: userAttributes };
  return event;
};
