const { isCorrespondenceRecord, upGenerator } = require('./utilities');

const mutateRecord = async item => {
  if (isCorrespondenceRecord(item)) {
    item.correspondenceId = item.documentId;
    delete item.documentId;
    return { ...item };
  }
};

module.exports = { mutateRecord, up: upGenerator(mutateRecord) };
