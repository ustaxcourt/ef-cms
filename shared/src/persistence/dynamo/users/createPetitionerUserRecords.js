const { put } = require('../../dynamodbClientService');

const createPetitionerUserRecords = async ({
  applicationContext,
  user,
  userId,
}) => {
  delete user.password;
  const formattedEmail = user.email.toLowerCase().trim();

  await Promise.all([
    put({
      Item: {
        ...user,
        pk: `user|${userId}`,
        sk: `user|${userId}`,
        userId,
      },
      applicationContext,
    }),
    put({
      Item: {
        pk: `user-email|${formattedEmail}`,
        sk: `user|${userId}`,
        userId,
      },
      applicationContext,
    }),
  ]);

  return {
    ...user,
    userId,
  };
};

exports.createPetitionerUserRecords = createPetitionerUserRecords;
