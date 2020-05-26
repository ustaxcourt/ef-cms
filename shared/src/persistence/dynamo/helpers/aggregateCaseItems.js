const { sortBy } = require('lodash');

exports.aggregateCaseItems = caseAndCaseItems => {
  const theCase = caseAndCaseItems
    .filter(item => item.sk.startsWith('case|'))
    .pop();

  const docketRecord = caseAndCaseItems.filter(item =>
    item.sk.startsWith('docket-record|'),
  );
  const documents = caseAndCaseItems.filter(item =>
    item.sk.startsWith('document|'),
  );
  const privatePractitioners = caseAndCaseItems.filter(item =>
    item.sk.startsWith('privatePractitioner|'),
  );
  const irsPractitioners = caseAndCaseItems.filter(item =>
    item.sk.startsWith('irsPractitioner|'),
  );
  const correspondences = caseAndCaseItems.filter(item =>
    item.sk.startsWith('correspondence|'),
  );

  const sortedDocketRecord = sortBy(docketRecord, 'index');
  const sortedDocuments = sortBy(documents, 'createdAt');
  const sortedCorrespondences = sortBy(correspondences, 'filingDate');

  return {
    ...theCase,
    correspondence: sortedCorrespondences,
    docketRecord: sortedDocketRecord,
    documents: sortedDocuments,
    irsPractitioners,
    privatePractitioners,
  };
};
