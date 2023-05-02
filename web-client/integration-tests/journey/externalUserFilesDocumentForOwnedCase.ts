import { OBJECTIONS_OPTIONS_MAP } from '../../../shared/src/business/entities/EntityConstants';
import { contactPrimaryFromState } from '../helpers';

export const externalUserFilesDocumentForOwnedCase = (
  cerebralTest,
  fakeFile,
  fileAcrossConsolidatedGroup?,
) => {
  return it('external user files a document for owned case', async () => {
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    const docketEntriesBefore = cerebralTest.getState(
      'caseDetail.docketEntries',
    ).length;

    await cerebralTest.runSequence('gotoFileDocumentSequence', {
      docketNumber: cerebralTest.docketNumber,
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

    const documentDetails = {
      attachments: false,
      certificateOfService: true,
      certificateOfServiceDay: '12',
      certificateOfServiceMonth: '12',
      certificateOfServiceYear: '2000',
      hasSupportingDocuments: false,
      objections: OBJECTIONS_OPTIONS_MAP.NO,
      primaryDocumentFile: fakeFile,
      primaryDocumentFileSize: 1,
    };

    for (const [key, value] of Object.entries(documentDetails)) {
      await cerebralTest.runSequence(
        'updateFileDocumentWizardFormValueSequence',
        {
          key,
          value,
        },
      );
    }

    const contactPrimary = contactPrimaryFromState(cerebralTest);

    if (fileAcrossConsolidatedGroup) {
      await cerebralTest.runSequence(
        'updateFileDocumentWizardFormValueSequence',
        {
          key: 'partyIrsPractitioner',
          value: true,
        },
      );
      await cerebralTest.runSequence(
        'updateFileDocumentWizardFormValueSequence',
        {
          key: `filersMap.${contactPrimary.contactId}`,
          value: false,
        },
      );
    } else {
      await cerebralTest.runSequence(
        'updateFileDocumentWizardFormValueSequence',
        {
          key: `filersMap.${contactPrimary.contactId}`,
          value: true,
        },
      );
    }

    await cerebralTest.runSequence('reviewExternalDocumentInformationSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({});

    if (fileAcrossConsolidatedGroup) {
      const form = cerebralTest.getState('form');

      expect(form.fileAcrossConsolidatedGroup).toEqual(true);
    }
    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'redactionAcknowledgement',
      value: true,
    });

    await cerebralTest.runSequence('submitExternalDocumentSequence');

    expect(cerebralTest.getState('caseDetail.docketEntries').length).toEqual(
      docketEntriesBefore + 1,
    );
  });
};
