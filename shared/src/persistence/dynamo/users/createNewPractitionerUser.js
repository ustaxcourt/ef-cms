const { createUserRecords } = require('./createPractitionerUser');

exports.createNewPractitionerUser = async ({ applicationContext, user }) => {
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
          Value: user.role,
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

  const updatedUser = await createUserRecords({
    applicationContext,
    user,
    userId,
  });

  return updatedUser;
};
