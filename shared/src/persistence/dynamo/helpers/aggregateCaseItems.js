const { sortBy } = require('lodash');

exports.aggregateCaseItems = caseAndCaseItems => {
  const theCase = caseAndCaseItems
    .filter(item => item.sk.startsWith('case|'))
    .pop();

  const documents = caseAndCaseItems.filter(
    item => item.sk.startsWith('document|') && !item.archived,
  );
  const archivedDocuments = caseAndCaseItems.filter(
    item => item.sk.startsWith('document|') && item.archived,
  );
  const privatePractitioners = caseAndCaseItems.filter(item =>
    item.sk.startsWith('privatePractitioner|'),
  );
  const irsPractitioners = caseAndCaseItems.filter(item =>
    item.sk.startsWith('irsPractitioner|'),
  );
  const correspondences = caseAndCaseItems.filter(
    item => item.sk.startsWith('correspondence|') && !item.archived,
  );
  const archivedCorrespondences = caseAndCaseItems.filter(
    item => item.sk.startsWith('correspondence|') && item.archived,
  );

  const sortedDocuments = sortBy(documents, 'createdAt');
  const sortedArchivedDocuments = sortBy(archivedDocuments, 'createdAt');
  const sortedCorrespondences = sortBy(correspondences, 'filingDate');
  const sortedArchivedCorrespondences = sortBy(
    archivedCorrespondences,
    'filingDate',
  );

  return {
    ...theCase,
    archivedCorrespondences: sortedArchivedCorrespondences,
    archivedDocuments: sortedArchivedDocuments,
    correspondence: sortedCorrespondences,
    documents: sortedDocuments,
    irsPractitioners,
    privatePractitioners,
  };
};
