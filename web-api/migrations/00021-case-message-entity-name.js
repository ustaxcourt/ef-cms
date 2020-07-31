const createApplicationContext = require('../src/applicationContext');
const { isCaseMessageRecord, upGenerator } = require('./utilities');
const applicationContext = createApplicationContext({});
const { Message } = require('../../shared/src/business/entities/Message');

const mutateRecord = async item => {
  if (isCaseMessageRecord(item)) {
    if (item.entityName !== Message.entityName) {
      const messageRecord = new Message(item, { applicationContext })
        .validate()
        .toRawObject();

      return { ...item, ...messageRecord };
    }
  }
};

module.exports = { mutateRecord, up: upGenerator(mutateRecord) };
