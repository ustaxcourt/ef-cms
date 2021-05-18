const client = require('../../dynamodbClientService');
const { ROLES } = require('../../../business/entities/EntityConstants');

const createUserRecords = async ({ applicationContext, newUser, userId }) => {
  await client.put({
    Item: {
      ...newUser,
      pk: `user|${userId}`,
      sk: `user|${userId}`,
      userId,
    },
    applicationContext,
  });

  return {
    ...newUser,
    userId,
  };
};

exports.createNewPetitionerUser = async ({ applicationContext, user }) => {
  const { userId } = user;

  await applicationContext
    .getCognito()
    .adminCreateUser({
      UserAttributes: [
        {
          Name: 'email_verified',
          Value: 'True',
        },
        {
          Name: 'email',
          Value: user.pendingEmail,
        },
        {
          Name: 'custom:role',
          Value: ROLES.petitioner,
        },
        {
          Name: 'name',
          Value: user.name,
        },
        {
          Name: 'custom:userId',
          Value: user.userId,
        },
      ],
      UserPoolId: process.env.USER_POOL_ID,
      Username: user.pendingEmail,
    })
    .promise();

  const newUser = await createUserRecords({
    applicationContext,
    newUser: user,
    userId,
  });

  return newUser;
};
