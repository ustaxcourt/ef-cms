export const cognitoLocalWrapper = cognito => {
  const originalAdminCreateUser = cognito.adminCreateUser;

  cognito.adminCreateUser = function (params) {
    return {
      promise: async () => {
        const convertedParams = {
          ...params,
          DesiredDeliveryMediums: ['EMAIL'],
        };

        const response = await originalAdminCreateUser
          .call(this, convertedParams)
          .promise();

        return new Promise(resolve => {
          response.User.Username = response.User.Attributes[0].Value;
          resolve(response);
        });
      },
    };
  };

  return cognito;
};
