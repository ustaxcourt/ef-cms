import { fakeFile } from '../helpers';

export const respondentUploadsProposedStipulatedDecision = test => {
  return it('respondent uploads a proposed stipulated decision', async () => {
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });

    test.setState('form', {
      attachments: false,
      category: 'Decision',
      certificateOfService: false,
      certificateOfServiceDate: null,
      documentTitle: 'Proposed Stipulated Decision',
      documentType: 'Proposed Stipulated Decision',
      eventCode: 'PSDE',
      hasSecondarySupportingDocuments: false,
      hasSupportingDocuments: false,
      partyIrsPractitioner: true,
      primaryDocumentFile: fakeFile,
      primaryDocumentFileSize: 115022,
      privatePractitioners: [],
      scenario: 'Standard',
      searchError: false,
    });
    await test.runSequence('submitExternalDocumentSequence');

    expect(test.getState('validationErrors')).toEqual({});
  });
};
