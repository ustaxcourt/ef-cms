import Case from '../../../../shared/src/business/entities/Case';

export default (test, fakeFile) => {
  return it('Respondent adds a stipulated decision', async () => {
    await test.runSequence('updateDocumentValueSequence', {
      key: 'documentType',
      value: Case.documentTypes.stipulatedDecision,
    });
    await test.runSequence('updateDocumentValueSequence', {
      key: 'file',
      value: fakeFile,
    });
    await test.runSequence('submitDocumentSequence');
    expect(test.getState('caseDetail.documents').length).toEqual(4);
  });
};
