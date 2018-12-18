/* istanbul ignore file */
// TODO: tests will come in the next PR
const persistence = require('../../awsDynamoPersistence');

exports.syncDocuments = async ({
  applicationContext,
  caseToSave,
  currentCaseState,
}) => {
  for (let document of caseToSave.documents || []) {
    const existing = (currentCaseState.documents || []).find(
      i => i.documentId === document.documentId,
    );
    if (!existing) {
      await persistence.createMappingRecord({
        pkId: document.documentId,
        skId: caseToSave.caseId,
        type: 'case',
        applicationContext,
      });
    }
  }
};
