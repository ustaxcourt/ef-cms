const { DynamoDB } = require('aws-sdk');
const { getClient } = require('../../../web-api/elasticsearch/client');

const environmentName = process.argv[2] || 'exp1';
const action = process.argv[4];
const userIdInput = process.argv[3] || 'asdf123';
const dynamodb = new DynamoDB({ region: 'us-east-1' });
const version = 'beta';

const removeFromES = async id => {
  console.log(`- removeFromES( ${id} )`);
  const esClient = await getClient({ environmentName });
  const res = await esClient.delete({
    id,
    index: 'efcms-work-item',
    refresh: true,
  });

  console.log(`- DONE: ${res ? 'success' : 'fail'}`);
};
const checkIfRecordExists = async ({ pk, sk }) => {
  const res = await dynamodb
    .getItem({
      Key: {
        pk: {
          S: pk,
        },
        sk: {
          S: sk,
        },
      },
      TableName: `efcms-${environmentName}-${version}`,
    })
    .promise();

  return !!res.Item;
};
const checkIfCompleted = async workItemId => {
  const res = await dynamodb
    .getItem({
      Key: {
        pk: {
          S: workItemId,
        },
        sk: {
          S: workItemId,
        },
      },
      TableName: `efcms-${environmentName}-${version}`,
    })
    .promise();

  console.log({
    completedAt: res.Item?.completedAt || '---',
    exists: !!res.Item,
  });
  if (!res.Item) {
    console.log(`${workItemId} does not exist!`);
    return true;
  } else if (res.Item.completedAt) {
    console.log(`${workItemId} was completed at: ${res.Item.completedAt}`);
    return true;
  }
  console.log(`${workItemId} was not completed: ${res.Item.completedAt}`);
  return false;
};

const getUsersByRole = async role => {
  const esClient = await getClient({ environmentName });
  const query = {
    body: {
      query: {
        term: {
          'role.S': role,
        },
      },
    },
    index: 'efcms-user',
    size: 50,
  };
  const results = await esClient.search(query);
  return results.hits.hits.map(hit => {
    console.log(hit);
    return hit['_source'].pk.S;
  });
};

const getWorkItemsForUser = async user => {
  const esClient = await getClient({ environmentName });
  const query = {
    body: {
      query: {
        bool: {
          must: [
            {
              term: {
                'pk.S': user,
              },
            },
          ],
          must_not: [
            {
              exists: {
                field: 'completedAt.S',
              },
            },
          ],
        },
      },
    },
    index: 'efcms-work-item',
    size: 500,
  };

  const results = await esClient.search(query);

  return results.hits.hits.map(hit => {
    console.log(hit);

    return {
      id: hit['_id'],
      pk: user,
      sk: hit['_source'].sk.S,
    };
  });
};

const removeFromDDB = async ({ pk, sk }) => {
  console.log({ pk, sk });
  const res = await dynamodb
    .deleteItem({
      Key: {
        pk: {
          S: pk,
        },
        sk: {
          S: sk,
        },
      },
      TableName: `efcms-${environmentName}-${version}`,
    })
    .promise();

  console.log(res);
  console.log('- deleted');
};

const fixForUser = async userId => {
  const workItems = await getWorkItemsForUser(userId);
  for (const workItem of workItems) {
    const exists = await checkIfRecordExists(workItem);
    const completed = await checkIfCompleted(workItem.sk);
    console.log({ completed });
    if (!exists) {
      await removeFromES(workItem.id);
    }
    if (completed) {
      await removeFromDDB(workItem);
    }
  }
  return userId;
};

const fixForRole = async role => {
  const users = await getUsersByRole(role);
  // console.log(users);
  for (const userId of users) {
    console.log(`-- ${userId} --`);
    // await fixForUser(userId);
  }
};

const fixForSection = async section => {
  const workItems = await getWorkItemsForSection(section);
  for (const workItem of workItems) {
    const exists = await checkIfRecordExists(workItem);
    if (!exists) {
      console.log(`this does not exist! ${workItem.id}`);
      await removeFromES(workItem.id);
      continue;
    }

    const completed = await checkIfCompleted(workItem.sk);
    if (completed) {
      console.log(`this is completed! ${workItem.sk}`);
      await removeFromDDB(workItem);
      continue;
    }

    console.log('- seems valid! 👍');
  }
};
const getWorkItemsForSection = async section => {
  const esClient = await getClient({ environmentName });
  const query = {
    body: {
      query: {
        bool: {
          must: [
            {
              term: {
                'pk.S': `section|${section}`,
              },
            },
            {
              term: {
                'section.S': section,
              },
            },
          ],
          must_not: {
            exists: {
              field: 'completedAt.S',
            },
          },
        },
      },
      size: 10000,
    },
    index: 'efcms-work-item',
  };
  const res = await esClient.search(query);
  console.log(res);
  return res.hits.hits.map(hit => {
    return {
      id: hit['_id'],
      pk: hit['_source'].pk.S,
      sk: hit['_source'].sk.S,
    };
  });
};

(async () => {
  switch (action) {
    case 'fixForUser':
      await fixForUser(`user|${userIdInput}`);
      break;
    case 'fixForRole':
      await fixForRole('docketclerk');
      break;
    case 'fixForSection':
      await fixForSection('docket');
      break;
  }
})();
