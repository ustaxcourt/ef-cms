export const cognitoLocalWrapper = cognito => {
  const originalAdminCreateUser = cognito.adminCreateUser;

  cognito.adminCreateUser = function (params) {
    const convertedParams = {
      ...params,
      DesiredDeliveryMediums: ['EMAIL'],
    };
    if (params.additionalAttributes) {
      convertedParams.UserAttributes.push(params.additionalAttributes);
      delete convertedParams.additionalAttributes;
    }
    return originalAdminCreateUser.call(this, convertedParams);
  };

  return cognito;
};
