const createApplicationContext = require('../../../web-api/src/applicationContext');
const { unmarshall } = require('aws-sdk').DynamoDB.Converter;

const compileUser = async (applicationContext, user) => {
  try {
    const cognito = applicationContext.getCognito();
    const res = await cognito
      .adminGetUser({
        UserPoolId: process.env.USER_POOL_ID,
        Username: user.email,
      })
      .promise();
    user.enabled = !!res.Enabled;
    user.exists = true;
  } catch (err) {
    user.enabled = false;
    user.exists = false;
  }
  return user;
};

(async () => {
  const applicationContext = createApplicationContext({});
  const internalRoles = {
    adc: 'adc',
    admissionsClerk: 'admissionsclerk',
    chambers: 'chambers',
    clerkOfCourt: 'clerkofcourt',
    docketClerk: 'docketclerk',
    floater: 'floater',
    general: 'general',
    judge: 'judge',
    petitionsClerk: 'petitionsclerk',
    reportersOffice: 'reportersOffice',
    trialClerk: 'trialclerk',
  };

  const res = await applicationContext.getSearchClient().search({
    body: {
      _source: ['name.S', 'role.S', 'email.S', 'section.S', 'userId.S'],
      query: {
        terms: {
          'role.S': Object.values(internalRoles),
        },
      },
      size: 10000,
    },
  });
  const users = await Promise.all(
    res.body.hits.hits
      .map(hit => unmarshall(hit['_source']))
      .map(user => compileUser(applicationContext, user)),
  );
  console.log('Role,Name,Section,Email,UserId,Exists,Enabled');
  users.forEach(user => {
    console.log(
      [
        user.role,
        user.name,
        user.section,
        user.email,
        user.userId,
        user.exists ? 'Yes' : 'No',
        user.enabled ? 'Yes' : 'No',
      ].join(','),
    );
  });
})();
