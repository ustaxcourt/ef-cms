const client = require('../../dynamodbClientService');

const createPetitionerUserRecords = async ({
  applicationContext,
  user,
  userId,
}) => {
  delete user.password;

  await client.put({
    Item: {
      ...user,
      pk: `user|${userId}`,
      sk: `user|${userId}`,
      userId,
    },
    applicationContext,
  });

  const formattedEmail = user.email.toLowerCase().trim();
  await client.put({
    Item: {
      pk: `user-email|${formattedEmail}`,
      sk: `user|${userId}`,
      userId,
    },
    applicationContext,
  });

  return {
    ...user,
    userId,
  };
};

exports.createPetitionerUserRecords = createPetitionerUserRecords;
