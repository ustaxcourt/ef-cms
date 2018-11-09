const awsPersistence = require('./awsPersistence');

exports.create = key => {
  switch (key) {
    case 'awsPersistence':
      return awsPersistence;
    default:
      throw new Error('unsupported persistence key type');
  }
}