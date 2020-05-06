const zlib = require('zlib');
const createApplicationContext = require('../../../src/applicationContext');
const { promisify } = require('util');

exports.handler = async event => {
  const applicationContext = createApplicationContext();

  if (event.awslogs && event.awslogs.data) {
    const payload = Buffer.from(event.awslogs.data, 'base64');

    const logevents = JSON.parse(zlib.unzipSync(payload).toString()).logEvents;

    for (const logevent of logevents) {
      await applicationContext.notifyHoneybadger(logevent);

      console.log(logevent);
    }
  }
};
