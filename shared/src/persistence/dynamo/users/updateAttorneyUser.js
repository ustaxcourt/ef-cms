const client = require('../../dynamodbClientService');
const {
  createMappingRecord,
} = require('../../dynamo/helpers/createMappingRecord');
const { getUserById } = require('./getUserById');
const { User } = require('../../../business/entities/User');

exports.updateUserRecords = async ({
  applicationContext,
  oldRole,
  oldSection,
  updatedUser,
  userId,
}) => {
  if (oldSection && updatedUser.section) {
    await client.delete({
      applicationContext,
      key: {
        pk: `${oldSection}|user`,
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
  }

  await client.put({
    Item: {
      pk: userId,
      sk: userId,
      ...updatedUser,
      userId,
    },
    applicationContext,
  });

  if (
    (updatedUser.role === User.ROLES.practitioner ||
      updatedUser.role === User.ROLES.respondent) &&
    updatedUser.name &&
    updatedUser.barNumber
  ) {
    await createMappingRecord({
      applicationContext,
      pkId: updatedUser.name,
      skId: userId,
      type: updatedUser.role,
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
  }

  return {
    ...user,
    userId,
  };
};

exports.updateAttorneyUserRole = async ({ applicationContext, user }) => {
  let userId;

  const oldUser = await getUserById({
    applicationContext,
    userId: user.userId,
  });

  try {
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
  } catch (error) {
    applicationContext.logger.error(error);
  }

  return await this.updateUserRecords({
    applicationContext,
    oldRole: oldUser.role,
    oldSection: oldUser.section,
    updatedUser: user,
    userId,
  });
};
