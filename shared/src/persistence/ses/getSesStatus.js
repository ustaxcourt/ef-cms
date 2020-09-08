const { execSync } = require('child_process');

exports.getSesStatus = async () => {
  const result = await execSync(
    'ping email.us-east-1.amazonaws.com -c 1 -W 10',
  );

  const receivedString = result.toString('utf8').split(',')[1];

  const receivedPackets = receivedString.split(' ')[1];

  return receivedPackets === '1';
};
