const {
  createISODateString,
} = require('../../shared/src/business/utilities/DateHandler');
const { Case } = require('../../shared/src/business/entities/cases/Case');
const { isCaseRecord, upGenerator } = require('./utilities');

const mutateRecord = item => {
  if (
    isCaseRecord(item) &&
    item.status === Case.STATUS_TYPES.closed &&
    !item.closedDate
  ) {
    item.closedDate = createISODateString();
    return item;
  }
};

module.exports = { mutateRecord, up: upGenerator(mutateRecord) };
