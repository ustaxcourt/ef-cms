const { isDocumentRecord, upGenerator } = require('./utilities');

const mutateRecord = async item => {
  if (isDocumentRecord(item)) {
    const sk = item.sk.replace('document|', 'docket-entry|');
    return { ...item, sk };
  }
};

module.exports = { mutateRecord, up: upGenerator(mutateRecord) };
