import { OBJECTIONS_OPTIONS_MAP } from '../../../shared/src/business/entities/EntityConstants';
import { contactPrimaryFromState } from '../helpers';

export const practitionerFilesDocumentForOwnedCase = (
  cerebralTest,
  fakeFile,
  caseDocketNumber?,
) => {
  return it('Practitioner files document for owned case', async () => {
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: caseDocketNumber || cerebralTest.docketNumber,
    });

    await cerebralTest.runSequence('gotoFileDocumentSequence', {
      docketNumber: caseDocketNumber || cerebralTest.docketNumber,
    });

    const documentToSelect = {
      category: 'Miscellaneous',
      documentTitle: 'Civil Penalty Approval Form',
      documentType: 'Civil Penalty Approval Form',
      eventCode: 'CIVP',
      scenario: 'Standard',
    };

    for (const [key, value] of Object.entries(documentToSelect)) {
      await cerebralTest.runSequence(
        'updateFileDocumentWizardFormValueSequence',
        {
          key,
          value,
        },
      );
    }

    await cerebralTest.runSequence('validateSelectDocumentTypeSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({});

    await cerebralTest.runSequence('completeDocumentSelectSequence');

    expect(cerebralTest.getState('form.documentType')).toEqual(
      'Civil Penalty Approval Form',
    );
    expect(cerebralTest.getState('form.partyPrimary')).toEqual(undefined);

    const { contactId } = contactPrimaryFromState(cerebralTest);
    const filingDetails = {
      attachments: false,
      certificateOfService: true,
      certificateOfServiceDay: '12',
      certificateOfServiceMonth: '12',
      certificateOfServiceYear: '2000',
      hasSupportingDocuments: false,
      objections: OBJECTIONS_OPTIONS_MAP.NO,
      primaryDocumentFile: fakeFile,
      primaryDocumentFileSize: 1,
      [`filersMap.${contactId}`]: true,
    };

    for (const [key, value] of Object.entries(filingDetails)) {
      await cerebralTest.runSequence(
        'updateFileDocumentWizardFormValueSequence',
        {
          key,
          value,
        },
      );
    }

    await cerebralTest.runSequence('reviewExternalDocumentInformationSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({});

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'redactionAcknowledgement',
      value: true,
    });

    await cerebralTest.runSequence('submitExternalDocumentSequence');

    const docketEntries = cerebralTest.getState('caseDetail.docketEntries');

    const newDocument = cerebralTest.getState(
      `caseDetail.docketEntries.${docketEntries.length - 1}`,
    );

    cerebralTest.docketEntryId = newDocument.docketEntryId;
  });
};
