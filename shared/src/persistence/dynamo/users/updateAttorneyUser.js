const client = require('../../dynamodbClientService');
const {
  createMappingRecord,
} = require('../../dynamo/helpers/createMappingRecord');
const { getUserById } = require('./getUserById');

exports.updateUserRecords = async ({
  applicationContext,
  oldUser,
  updatedUser,
  userId,
}) => {
  await client.delete({
    applicationContext,
    key: {
      pk: `${oldUser.section}|user`,
      sk: userId,
    },
  });

  await client.put({
    Item: {
      pk: `${updatedUser.section}|user`,
      sk: userId,
    },
    applicationContext,
  });

  await client.put({
    Item: {
      pk: userId,
      sk: userId,
      ...updatedUser,
      userId,
    },
    applicationContext,
  });

  await client.delete({
    applicationContext,
    key: {
      pk: `${oldUser.name}|${oldUser.role}`,
      sk: userId,
    },
  });

  await client.delete({
    applicationContext,
    key: {
      pk: `${oldUser.barNumber}|${oldUser.role}`,
      sk: userId,
    },
  });

  await createMappingRecord({
    applicationContext,
    pkId: updatedUser.name,
    skId: userId,
    type: updatedUser.role,
  });

  await createMappingRecord({
    applicationContext,
    pkId: updatedUser.barNumber,
    skId: userId,
    type: updatedUser.role,
  });

  return {
    ...updatedUser,
    userId,
  };
};

exports.updateAttorneyUser = async ({ applicationContext, user }) => {
  const { userId } = user;

  const oldUser = await getUserById({
    applicationContext,
    userId,
  });

  try {
    const response = await applicationContext
      .getCognito()
      .adminGetUser({
        UserPoolId: process.env.USER_POOL_ID,
        Username: user.email,
      })
      .promise();

    if (response) {
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
  } catch (error) {
    applicationContext.logger.error(error);
  }

  return await exports.updateUserRecords({
    applicationContext,
    oldUser,
    updatedUser: user,
    userId,
  });
};
