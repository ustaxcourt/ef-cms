const axios = require('axios');
const fs = require('fs');

if (!process.env.TOKEN) {
  console.log('Please set the TOKEN environment variable');
  process.exit(1);
}
const ITERATIONS = 250;

const userIds = fs
  .readFileSync('./user-ids.csv', 'utf8')
  .trim('\n')
  .split('\n');

const sections = fs
  .readFileSync('./sections.csv', 'utf8')
  .trim('\n')
  .split('\n');

(async () => {
  for (let i = 0; i < ITERATIONS; i++) {
    await Promise.all(
      userIds.map((userId, j) => {
        const toSection = sections[j];
        console.log(
          `sending a message to userId: ${userId}, section: ${toSection}`,
        );
        return axios.post(
          'https://api-blue.test.ef-cms.ustaxcourt.gov/messages/',
          {
            attachments: [],
            docketNumber: '105-20',
            message: Math.random() + 'asdf',
            subject: Math.random() + 'asdf',
            toSection,
            toUserId: userId,
          },
          {
            headers: {
              Authorization: `Bearer ${process.env.TOKEN}`,
            },
          },
        );
      }),
    ).catch(() => console.log('an error occured'));
  }
})();
