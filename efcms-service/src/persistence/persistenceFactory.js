const awsS3Persistence = require('./aws/awsS3Persistence');
const awsDynamoPersistence = require('./aws/awsDynamoPersistence');

exports.create = key => {
  switch (key) {
    case 'awsS3Persistence':
      return awsS3Persistence;
    case 'awsDynamoPersistence':
      return awsDynamoPersistence;
    default:
      throw new Error('unsupported persistence key type');
  }
}