const { Case } = require('../../shared/src/business/entities/cases/Case');
const { isCaseRecord, upGenerator } = require('./utilities');

const mutateRecord = item => {
  if (
    isCaseRecord(item) &&
    ['Batched for IRS', 'Recalled'].includes(item.status)
  ) {
    item.status = Case.STATUS_TYPES.inProgress;

    return item;
  }
};

module.exports = { mutateRecord, up: upGenerator(mutateRecord) };
