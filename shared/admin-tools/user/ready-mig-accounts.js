const AWS = require('aws-sdk');
const { getClient } = require('../../../web-api/elasticsearch/client');
const { getUserPoolId } = require('../util');
const users = [
  'judge.buch',
  'susan.culbreath',
  'meggan.barker',
  'samantha.skabelund',
  'zachary.fried',
  'jennifer.preston',
];

const ENV = process.argv[2];
const RESEND = process.argv[3] || false;

const cognito = new AWS.CognitoIdentityServiceProvider({ region: 'us-east-1' });

const checkAccountExists = async ({ Username, UserPoolId }) => {
  try {
    console.log(Username);
    // ensure there's a cognito account for them
    const res = await cognito
      .adminGetUser({
        UserPoolId,
        Username,
      })
      .promise();

    return res;
  } catch (err) {
    if (err.code === 'UserNotFoundException') {
      return;
    }
    console.log(err);
    throw err;
  }
};

const ensureUserAccount = async ({ role, userId, Username, UserPoolId }) => {
  const res = await checkAccountExists({ UserPoolId, Username });

  if (!res) {
    console.log({ userId, Username, UserPoolId, role });
    const res = await cognito
      .adminCreateUser({
        MessageAction: 'SUPPRESS',
        UserAttributes: [
          {
            Name: 'custom:userId',
            Value: userId,
          },
          {
            Name: 'custom:role',
            Value: role,
          },
        ],
        UserPoolId,
        Username,
      })
      .promise();
  } else {
    // ensure that they have the right userId, are confirmed
    console.log(res);
  }
};

const lookupUser = async user => {
  switch (user) {
    case 'susan.culbreath':
      return {
        role: 'adc',
        userId: 'b4652e41-e4bb-4d3e-a8aa-6ce8041a1581',
      };
    case 'meagan.singer':
      return {
        role: 'chambers',
        userId: 'b17c8b44-2952-4f36-910f-6ef0ac581207',
      };
    case 'nancy.ciliberti':
      return {
        role: 'general',
        userId: '32d9a771-6983-4d9d-a9ad-c2b84079f87d',
      };
  }
  const esClient = await getClient({ environmentName: ENV });
  const query = {
    bool: {
      must: [
        {
          terms: {
            'role.S': [
              'judge',
              'petitionsclerk',
              'docketclerk',
              'admissionsclerk',
              'clerkofcourt',
              'chambers',
              'adc',
              'general',
            ],
          },
        },
        { match: { 'name.S': user.replace('.', ' & ') } },
      ],
    },
  };

  try {
    const results = await esClient.search({
      body: { query },
      index: 'efcms-user',
      size: 1000,
    });
    if (results.hits.hits.length > 0) {
      return {
        role: results.hits.hits[0]['_source']['role'].S,
        userId: results.hits.hits[0]['_source']['userId'].S,
      };
    }
    throw `Could not find ${user}`;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

(async () => {
  // for each user, we need to ..

  const UserPoolId = await getUserPoolId();

  for (const user of users) {
    // get UserId in DB
    const { role, userId } = await lookupUser(user);

    // Ensure Cognito account exists for them
    const Username = `${user}@ustaxcourt.gov`;
    await ensureUserAccount({
      UserPoolId,
      Username,
      role,
      userId,
    });

    // resend temporary password
    if (RESEND) {
      const resent = await cognito
        .adminCreateUser({
          MessageAction: 'RESEND',
          UserPoolId,
          Username,
        })
        .promise();

      console.log(resent);
    }
    console.log('--------------------');
  }
})();
