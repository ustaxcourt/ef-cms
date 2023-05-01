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

    for (const key of Object.keys(documentToSelect)) {
      await cerebralTest.runSequence(
        'updateFileDocumentWizardFormValueSequence',
        {
          key,
          value: documentToSelect[key],
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

    const contactPrimary = contactPrimaryFromState(cerebralTest);
    /* eslint-disable sort-keys-fix/sort-keys-fix */
    const filingDetails = {
      certificateOfService: true,
      hasSupportingDocuments: false,
      attachments: false,
      objections: OBJECTIONS_OPTIONS_MAP.NO,
      certificateOfServiceMonth: '12',
      certificateOfServiceDay: '12',
      certificateOfServiceYear: '2000',
      primaryDocumentFile: fakeFile,
      primaryDocumentFileSize: 1,
      [`filersMap.${contactPrimary.contactId}`]: true,
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
