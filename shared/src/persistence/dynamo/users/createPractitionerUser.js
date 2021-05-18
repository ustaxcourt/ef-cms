const client = require('../../dynamodbClientService');
const { ROLES } = require('../../../business/entities/EntityConstants');

exports.createUserRecords = async ({ applicationContext, user, userId }) => {
  delete user.password;

  if (user.barNumber === '') {
    delete user.barNumber;
  }

  await client.put({
    Item: {
      ...user,
      pk: `user|${userId}`,
      sk: `user|${userId}`,
      userId,
    },
    applicationContext,
  });

  if (user.name && user.barNumber) {
    const upperCaseName = user.name.toUpperCase();
    await client.put({
      Item: {
        pk: `${user.role}|${upperCaseName}`,
        sk: `user|${userId}`,
      },
      applicationContext,
    });
    const upperCaseBarNumber = user.barNumber.toUpperCase();
    await client.put({
      Item: {
        pk: `${user.role}|${upperCaseBarNumber}`,
        sk: `user|${userId}`,
      },
      applicationContext,
    });
  }

  return {
    ...user,
    userId,
  };
};

exports.createPractitionerUser = async ({ applicationContext, user }) => {
  let userId = applicationContext.getUniqueId();
  const practitionerRoleTypes = [
    ROLES.privatePractitioner,
    ROLES.irsPractitioner,
    ROLES.inactivePractitioner,
  ];

  if (!practitionerRoleTypes.includes(user.role)) {
    throw new Error(
      `Role must be ${ROLES.privatePractitioner}, ${ROLES.irsPractitioner}, or ${ROLES.inactivePractitioner}`,
    );
  }

  if (user.email) {
    try {
      const response = await applicationContext
        .getCognito()
        .adminCreateUser({
          UserAttributes: [
            {
              Name: 'email_verified',
              Value: 'True',
            },
            {
              Name: 'email',
              Value: user.email,
            },
            {
              Name: 'custom:role',
              Value: user.role,
            },
            {
              Name: 'name',
              Value: user.name,
            },
          ],
          UserPoolId: process.env.USER_POOL_ID,
          Username: user.email,
        })
        .promise();

      if (response && response.User && response.User.Username) {
        userId = response.User.Username;
      }
    } catch (err) {
      applicationContext.logger.error(err);
      // the user already exists
      const response = await applicationContext
        .getCognito()
        .adminGetUser({
          UserPoolId: process.env.USER_POOL_ID,
          Username: user.email,
        })
        .promise();

      await applicationContext
        .getCognito()
        .adminUpdateUserAttributes({
          UserAttributes: [
            {
              Name: 'custom:role',
              Value: user.role,
            },
          ],
          UserPoolId: process.env.USER_POOL_ID,
          Username: response.Username,
        })
        .promise();

      userId = response.Username;
    }
  }

  return await exports.createUserRecords({
    applicationContext,
    user,
    userId,
  });
};
