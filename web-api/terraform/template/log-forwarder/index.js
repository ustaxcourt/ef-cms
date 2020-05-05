const zlib = require('zlib');

exports.handler = async event => {
  if (event.awslogs && event.awslogs.data) {
    const payload = Buffer.from(event.awslogs.data, 'base64');

    const logevents = JSON.parse(zlib.unzipSync(payload).toString()).logEvents;

    for (const logevent of logevents) {
      const log = JSON.parse(logevent.message);
      console.log(log);
    }
  }
};
