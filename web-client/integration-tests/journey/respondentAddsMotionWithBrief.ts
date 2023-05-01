import { OBJECTIONS_OPTIONS_MAP } from '../../../shared/src/business/entities/EntityConstants';
import { VALIDATION_ERROR_MESSAGES } from '../../../shared/src/business/entities/externalDocument/ExternalDocumentInformationFactory';
import { contactPrimaryFromState } from '../helpers';

export const respondentAddsMotionWithBrief = (
  cerebralTest,
  fakeFile,
  overrides,
) => {
  return it('Respondent adds Motion with supporting Brief', async () => {
    await cerebralTest.runSequence('gotoFileDocumentSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    await cerebralTest.runSequence('completeDocumentSelectSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({
      category: VALIDATION_ERROR_MESSAGES.category,
      documentType: VALIDATION_ERROR_MESSAGES.documentType[1],
    });

    await cerebralTest.runSequence(
      'updateFileDocumentWizardFormValueSequence',
      {
        key: 'category',
        value: 'Motion',
      },
    );

    await cerebralTest.runSequence('validateSelectDocumentTypeSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({
      documentType: VALIDATION_ERROR_MESSAGES.documentType[1],
    });

    const documentToSelect = {
      category: 'Motion',
      documentTitle: 'Motion for Continuance',
      documentType: 'Motion for Continuance',
      eventCode: 'M006',
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
      'Motion for Continuance',
    );

    expect(cerebralTest.getState('form.partyPrimary')).toBeUndefined();

    const { contactId } = contactPrimaryFromState(cerebralTest);
    const filingDetails = {
      attachments: false,
      certificateOfService: false,
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

    await cerebralTest.runSequence('addSupportingDocumentToFormSequence', {
      type: 'primary',
    });

    const supportingDocumentDetails = {
      ['supportingDocuments.0.category']: 'Supporting Document',
      ['supportingDocuments.0.documentType']: 'Brief in Support',
      ['supportingDocuments.0.previousDocument']: {
        documentTitle: cerebralTest.getState('form.documentTitle'),
        documentType: cerebralTest.getState('form.documentType'),
      },
      ['supportingDocuments.0.supportingDocument']: 'Brief in Support',
    };

    for (const [key, value] of Object.entries(supportingDocumentDetails)) {
      await cerebralTest.runSequence(
        'updateFileDocumentWizardFormValueSequence',
        {
          key,
          value,
        },
      );
    }

    await cerebralTest.runSequence('reviewExternalDocumentInformationSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({
      objections: VALIDATION_ERROR_MESSAGES.objections,
      supportingDocuments: [
        {
          index: 0,
          supportingDocumentFile:
            VALIDATION_ERROR_MESSAGES.supportingDocumentFile,
        },
      ],
    });

    await cerebralTest.runSequence(
      'updateFileDocumentWizardFormValueSequence',
      {
        key: 'objections',
        value: OBJECTIONS_OPTIONS_MAP.YES,
      },
    );

    await cerebralTest.runSequence(
      'updateFileDocumentWizardFormValueSequence',
      {
        key: 'supportingDocuments.0.supportingDocumentFile',
        value: fakeFile,
      },
    );

    await cerebralTest.runSequence(
      'updateFileDocumentWizardFormValueSequence',
      {
        key: 'supportingDocuments.0.supportingDocumentFileSize',
        value: 1,
      },
    );

    await cerebralTest.runSequence('reviewExternalDocumentInformationSequence');

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'redactionAcknowledgement',
      value: true,
    });

    await cerebralTest.runSequence('submitExternalDocumentSequence');

    expect(cerebralTest.getState('caseDetail.docketEntries').length).toEqual(
      overrides.documentCount,
    );
  });
};
