const client = require('../../dynamodbClientService');
const { ROLES } = require('../../../business/entities/EntityConstants');

const createUserRecords = async ({ applicationContext, newUser, userId }) => {
  await client.put({
    Item: {
      pk: `user|${userId}`,
      sk: `user|${userId}`,
      ...newUser,
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
          Name: 'email_verified', // TODO: remove this probably
          Value: 'True',
        },
        {
          Name: 'email',
          Value: user.email,
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
      Username: user.email,
    })
    .promise();

  const newUser = await createUserRecords({
    applicationContext,
    newUser: user,
    userId,
  });

  return newUser;
};
