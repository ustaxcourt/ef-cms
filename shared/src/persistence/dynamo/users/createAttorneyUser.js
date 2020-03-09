const client = require('../../dynamodbClientService');
const {
  createMappingRecord,
} = require('../../dynamo/helpers/createMappingRecord');
const { User } = require('../../../business/entities/User');

exports.createUserRecords = async ({ applicationContext, user, userId }) => {
  delete user.password;

  if (user.barNumber === '') {
    delete user.barNumber;
  }

  if (user.section) {
    await client.put({
      Item: {
        pk: `${user.section}|user`,
        sk: userId,
      },
      applicationContext,
    });
  }

  await client.put({
    Item: {
      pk: userId,
      sk: userId,
      ...user,
      userId,
    },
    applicationContext,
  });

  if (
    (user.role === User.ROLES.privatePractitioner ||
      user.role === User.ROLES.irsPractitioner) &&
    user.name &&
    user.barNumber
  ) {
    await createMappingRecord({
      applicationContext,
      pkId: user.name,
      skId: userId,
      type: user.role,
    });

    await createMappingRecord({
      applicationContext,
      pkId: user.barNumber,
      skId: userId,
      type: user.role,
    });
  }

  return {
    ...user,
    userId,
  };
};

exports.createAttorneyUser = async ({ applicationContext, user }) => {
  const userId = applicationContext.getUniqueId();

  if (user.email) {
    try {
      await applicationContext
        .getCognito()
        .adminCreateUser({
          UserAttributes: [
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
    } catch (err) {
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
    }
  }

  return await exports.createUserRecords({
    applicationContext,
    user,
    userId,
  });
};
