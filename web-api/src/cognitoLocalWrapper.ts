const cognitoFunctions = [
  'adminCreateUser',
  'adminDisableUser',
  'adminGetUser',
  'adminUpdateUserAttributes',
  'confirmSignUp',
  'initiateAuth',
  'listUsers',
  'respondToAuthChallenge',
  'signUp',
];

export const cognitoLocalWrapper = cognito => {
  for (const methodName in cognito) {
    if (typeof cognito[methodName] === 'function') {
      if (cognitoFunctions.includes(methodName)) {
        const originalMethod = cognito[methodName];

        cognito[methodName] = function (params) {
          return {
            promise: async () => {
              if (methodName === 'adminCreateUser') {
                params.DesiredDeliveryMediums = ['EMAIL'];
              }
              const response = await originalMethod
                .call(this, params)
                .promise();

              return new Promise(resolve => {
                if (response.User) {
                  // returning 'sub' attribute as username
                  response.User.Username = response.User.Attributes[0].Value;
                }
                resolve(response);
              });
            },
          };
        };
      } else if (methodName === 'resendConfirmationCode') {
        cognito[methodName] = function (params) {
          return {
            promise: async () => {
              return new Promise(resolve => {
                resolve({
                  CodeDeliveryDetails: {
                    AttributeName: 'Email',
                    DeliveryMedium: 'Email',
                    Destination: `${params.Username}`,
                  },
                });
              });
            },
          };
        };
      }
    }
  }
  return cognito;
};
