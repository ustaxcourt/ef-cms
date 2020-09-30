const { sortBy } = require('lodash');

const getAssociatedJudge = (theCase, caseAndCaseItems) => {
  if (theCase && theCase.judgeUserId) {
    const associatedJudgeId = caseAndCaseItems.find(
      item => item.sk === `user|${theCase.judgeUserId}`,
    );
    return associatedJudgeId ? associatedJudgeId.name : undefined;
  } else if (theCase && theCase.associatedJudge) {
    return theCase.associatedJudge;
  }
};

exports.aggregateCaseItems = caseAndCaseItems => {
  const theCase = caseAndCaseItems
    .filter(item => item.sk.startsWith('case|'))
    .pop();

  const documents = caseAndCaseItems.filter(
    item => item.sk.startsWith('docket-entry|') && !item.archived,
  );
  const archivedDocketEntries = caseAndCaseItems.filter(
    item => item.sk.startsWith('docket-entry|') && item.archived,
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
  const sortedArchivedDocketEntries = sortBy(
    archivedDocketEntries,
    'createdAt',
  );
  const sortedCorrespondences = sortBy(correspondences, 'filingDate');
  const sortedArchivedCorrespondences = sortBy(
    archivedCorrespondences,
    'filingDate',
  );

  return {
    ...theCase,
    archivedCorrespondences: sortedArchivedCorrespondences,
    archivedDocketEntries: sortedArchivedDocketEntries,
    associatedJudge: getAssociatedJudge(theCase, caseAndCaseItems),
    correspondence: sortedCorrespondences,
    docketEntries: sortedDocuments,
    irsPractitioners,
    privatePractitioners,
  };
};
