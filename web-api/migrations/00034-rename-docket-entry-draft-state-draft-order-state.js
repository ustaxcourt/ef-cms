const { isDocketEntryRecord, upGenerator } = require('./utilities');

const mutateRecord = async item => {
  if (isDocketEntryRecord(item)) {
    item.draftOrderState = item.draftState;
    delete item.draftState;

    return { ...item };
  }
};

module.exports = { mutateRecord, up: upGenerator(mutateRecord) };
