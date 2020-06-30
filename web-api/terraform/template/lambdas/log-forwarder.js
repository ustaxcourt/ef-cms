const Honeybadger = require('honeybadger');
const zlib = require('zlib');

const honeybadger = Honeybadger.configure({
  apiKey: process.env.CIRCLE_HONEYBADGER_API_KEY,
  environment: 'api',
});

exports.handler = async event => {
  if (event.awslogs && event.awslogs.data) {
    const payload = Buffer.from(event.awslogs.data, 'base64');

    const logevents = JSON.parse(zlib.unzipSync(payload).toString()).logEvents;

    for (const logevent of logevents) {
      await new Promise(resolve => {
        honeybadger.notify(logevent, null, null, resolve);
      });

      console.log(logevent);
    }
  }
};
