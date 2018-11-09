const { entityPersistenceLookup } = require('../environment');
const { create: persistenceFactory } = require('./persistenceFactory');

exports.create = key => {
  return persistenceFactory(
    entityPersistenceLookup(key)
  );
}