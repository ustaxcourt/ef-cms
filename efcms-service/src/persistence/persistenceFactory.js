const awsS3Persistence = require('./aws/awsS3Persistence');

exports.create = key => {
  switch (key) {
    case 'awsS3Persistence':
      return awsS3Persistence;
    default:
      throw new Error('unsupported persistence key type');
  }
}