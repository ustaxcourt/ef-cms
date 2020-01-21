const { isAssociatedUser } = require('../../entities/cases/Case');
const { map } = require('lodash');
const CASE_ATTRIBUTE_WHITELIST = ['docketNumber'];

const caseSealedFormatter = caseRaw => map(caseRaw, CASE_ATTRIBUTE_WHITELIST);

const caseSearchFilter = (cases, userId) => {
  const results = [];
  for (const caseRaw of cases) {
    if (!caseRaw.sealedDate || isAssociatedUser({ caseRaw, userId })) {
      results.push(caseRaw);
    }
  }
  return results;
};

module.exports = {
  caseSealedFormatter,
  caseSearchFilter,
};
