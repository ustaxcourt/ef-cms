import { VALIDATION_ERROR_MESSAGES } from '../../../shared/src/business/entities/externalDocument/ExternalDocumentInformationFactory';
import { applicationContextForClient as applicationContext } from '../../../shared/src/business/test/createTestApplicationContext';
import { contactPrimaryFromState } from '../helpers';

export const petitionerFilesDocumentForCase = (test, fakeFile) => {
  const { OBJECTIONS_OPTIONS_MAP } = applicationContext.getConstants();

  return it('petitioner files document for case', async () => {
    await test.runSequence('gotoFileDocumentSequence', {
      docketNumber: test.docketNumber,
    });

    await test.runSequence('completeDocumentSelectSequence');

    expect(test.getState('validationErrors')).toEqual({
      category: VALIDATION_ERROR_MESSAGES.category,
      documentType: VALIDATION_ERROR_MESSAGES.documentType[1],
    });

    await test.runSequence('updateFileDocumentWizardFormValueSequence', {
      key: 'category',
      value: 'Answer (filed by respondent only)',
    });

    await test.runSequence('validateSelectDocumentTypeSequence');
    expect(test.getState('validationErrors')).toEqual({
      documentType: VALIDATION_ERROR_MESSAGES.documentType[1],
    });

    await test.runSequence('updateFileDocumentWizardFormValueSequence', {
      key: 'documentType',
      value: 'Answer',
    });
    await test.runSequence('updateFileDocumentWizardFormValueSequence', {
      key: 'documentTitle',
      value: 'Answer',
    });
    await test.runSequence('updateFileDocumentWizardFormValueSequence', {
      key: 'eventCode',
      value: 'A',
    });
    await test.runSequence('updateFileDocumentWizardFormValueSequence', {
      key: 'scenario',
      value: 'Standard',
    });

    await test.runSequence('validateSelectDocumentTypeSequence');

    expect(test.getState('validationErrors')).toEqual({});

    await test.runSequence('completeDocumentSelectSequence');

    expect(test.getState('form.documentType')).toEqual('Answer');

    await test.runSequence('updateFileDocumentWizardFormValueSequence', {
      key: 'category',
      value: 'Motion',
    });

    await test.runSequence('completeDocumentSelectSequence');

    expect(test.getState('validationErrors')).toEqual({
      documentType: VALIDATION_ERROR_MESSAGES.documentType[1],
    });

    await test.runSequence('updateFileDocumentWizardFormValueSequence', {
      key: 'documentType',
      value: 'Motion for Leave to File Out of Time',
    });
    await test.runSequence('updateFileDocumentWizardFormValueSequence', {
      key: 'documentTitle',
      value: 'Motion for Leave to File Out of Time [Document Name]',
    });
    await test.runSequence('updateFileDocumentWizardFormValueSequence', {
      key: 'eventCode',
      value: 'M014',
    });
    await test.runSequence('updateFileDocumentWizardFormValueSequence', {
      key: 'scenario',
      value: 'Nonstandard H',
    });

    await test.runSequence('completeDocumentSelectSequence');

    expect(test.getState('validationErrors')).toEqual({
      secondaryDocument: {
        category: VALIDATION_ERROR_MESSAGES.category,
        documentType: VALIDATION_ERROR_MESSAGES.documentType[1],
      },
    });

    await test.runSequence('updateFileDocumentWizardFormValueSequence', {
      key: 'secondaryDocument.category',
      value: 'Statement',
    });

    await test.runSequence('updateFileDocumentWizardFormValueSequence', {
      key: 'secondaryDocument.documentType',
      value: 'Statement',
    });
    await test.runSequence('updateFileDocumentWizardFormValueSequence', {
      key: 'secondaryDocument.documentTitle',
      value: 'Statement [anything]',
    });
    await test.runSequence('updateFileDocumentWizardFormValueSequence', {
      key: 'secondaryDocument.eventCode',
      value: 'STAT',
    });
    await test.runSequence('updateFileDocumentWizardFormValueSequence', {
      key: 'secondaryDocument.scenario',
      value: 'Nonstandard B',
    });

    await test.runSequence('completeDocumentSelectSequence');

    expect(test.getState('validationErrors')).toEqual({
      secondaryDocument: {
        freeText: VALIDATION_ERROR_MESSAGES.freeText[0].message,
      },
    });

    await test.runSequence('updateFileDocumentWizardFormValueSequence', {
      key: 'secondaryDocument.freeText',
      value: 'Anything',
    });

    await test.runSequence('completeDocumentSelectSequence');

    expect(test.getState('validationErrors')).toEqual({});

    expect(test.getState('form.documentTitle')).toEqual(
      'Motion for Leave to File Out of Time Statement Anything',
    );

    const contactPrimary = contactPrimaryFromState(test);

    await test.runSequence('updateFileDocumentWizardFormValueSequence', {
      key: `filersMap.${contactPrimary.contactId}`,
      value: true,
    });

    await test.runSequence('reviewExternalDocumentInformationSequence');

    expect(test.getState('form.filers')).toEqual([contactPrimary.contactId]);

    expect(test.getState('validationErrors')).toEqual({
      objections: VALIDATION_ERROR_MESSAGES.objections,
      primaryDocumentFile: VALIDATION_ERROR_MESSAGES.primaryDocumentFile,
      secondaryDocumentFile: VALIDATION_ERROR_MESSAGES.secondaryDocumentFile,
    });

    await test.runSequence('updateFileDocumentWizardFormValueSequence', {
      key: 'certificateOfService',
      value: true,
    });

    await test.runSequence('addSupportingDocumentToFormSequence', {
      type: 'primary',
    });

    await test.runSequence('validateExternalDocumentInformationSequence');
    expect(test.getState('validationErrors')).toEqual({
      certificateOfServiceDate:
        VALIDATION_ERROR_MESSAGES.certificateOfServiceDate[1],
      objections: VALIDATION_ERROR_MESSAGES.objections,
      primaryDocumentFile: VALIDATION_ERROR_MESSAGES.primaryDocumentFile,
      secondaryDocumentFile: VALIDATION_ERROR_MESSAGES.secondaryDocumentFile,
      supportingDocuments: [
        {
          index: 0,
          supportingDocument: VALIDATION_ERROR_MESSAGES.supportingDocument,
        },
      ],
    });

    await test.runSequence('updateFileDocumentWizardFormValueSequence', {
      key: 'objections',
      value: OBJECTIONS_OPTIONS_MAP.NO,
    });

    await test.runSequence('validateExternalDocumentInformationSequence');
    expect(test.getState('validationErrors')).toEqual({
      certificateOfServiceDate:
        VALIDATION_ERROR_MESSAGES.certificateOfServiceDate[1],
      primaryDocumentFile: VALIDATION_ERROR_MESSAGES.primaryDocumentFile,
      secondaryDocumentFile: VALIDATION_ERROR_MESSAGES.secondaryDocumentFile,
      supportingDocuments: [
        {
          index: 0,
          supportingDocument: VALIDATION_ERROR_MESSAGES.supportingDocument,
        },
      ],
    });

    await test.runSequence('updateFileDocumentWizardFormValueSequence', {
      key: 'certificateOfServiceMonth',
      value: '12',
    });
    await test.runSequence('updateFileDocumentWizardFormValueSequence', {
      key: 'certificateOfServiceDay',
      value: '12',
    });
    await test.runSequence('updateFileDocumentWizardFormValueSequence', {
      key: 'certificateOfServiceYear',
      value: '5000',
    });

    await test.runSequence('validateExternalDocumentInformationSequence');
    expect(test.getState('validationErrors')).toEqual({
      certificateOfServiceDate:
        VALIDATION_ERROR_MESSAGES.certificateOfServiceDate[0].message,
      primaryDocumentFile: VALIDATION_ERROR_MESSAGES.primaryDocumentFile,
      secondaryDocumentFile: VALIDATION_ERROR_MESSAGES.secondaryDocumentFile,
      supportingDocuments: [
        {
          index: 0,
          supportingDocument: VALIDATION_ERROR_MESSAGES.supportingDocument,
        },
      ],
    });

    await test.runSequence('updateFileDocumentWizardFormValueSequence', {
      key: 'certificateOfServiceYear',
      value: '2000',
    });

    await test.runSequence('validateExternalDocumentInformationSequence');
    expect(test.getState('validationErrors')).toEqual({
      primaryDocumentFile: VALIDATION_ERROR_MESSAGES.primaryDocumentFile,
      secondaryDocumentFile: VALIDATION_ERROR_MESSAGES.secondaryDocumentFile,
      supportingDocuments: [
        {
          index: 0,
          supportingDocument: VALIDATION_ERROR_MESSAGES.supportingDocument,
        },
      ],
    });

    await test.runSequence('updateFileDocumentWizardFormValueSequence', {
      key: 'supportingDocuments.0.category',
      value: 'Supporting Document',
    });
    await test.runSequence('updateFileDocumentWizardFormValueSequence', {
      key: 'supportingDocuments.0.documentType',
      value: 'Affidavit in Support',
    });

    await test.runSequence('updateFileDocumentWizardFormValueSequence', {
      key: 'supportingDocuments.0.previousDocument',
      value: {
        documentTitle: test.getState('form.documentTitle'),
        documentType: test.getState('form.documentType'),
      },
    });
    await test.runSequence('updateFileDocumentWizardFormValueSequence', {
      key: 'supportingDocuments.0.supportingDocument',
      value: 'Affidavit in Support',
    });

    await test.runSequence('validateExternalDocumentInformationSequence');
    expect(test.getState('validationErrors')).toEqual({
      primaryDocumentFile: VALIDATION_ERROR_MESSAGES.primaryDocumentFile,
      secondaryDocumentFile: VALIDATION_ERROR_MESSAGES.secondaryDocumentFile,
      supportingDocuments: [
        {
          index: 0,
          supportingDocumentFile:
            VALIDATION_ERROR_MESSAGES.supportingDocumentFile,
          supportingDocumentFreeText:
            VALIDATION_ERROR_MESSAGES.supportingDocumentFreeText,
        },
      ],
    });

    await test.runSequence('updateFileDocumentWizardFormValueSequence', {
      key: 'supportingDocuments.0.supportingDocumentFreeText',
      value: 'Affidavit in Support',
    });

    await test.runSequence('validateExternalDocumentInformationSequence');
    expect(test.getState('validationErrors')).toEqual({
      primaryDocumentFile: VALIDATION_ERROR_MESSAGES.primaryDocumentFile,
      secondaryDocumentFile: VALIDATION_ERROR_MESSAGES.secondaryDocumentFile,
      supportingDocuments: [
        {
          index: 0,
          supportingDocumentFile:
            VALIDATION_ERROR_MESSAGES.supportingDocumentFile,
        },
      ],
    });

    await test.runSequence('updateFileDocumentWizardFormValueSequence', {
      key: 'primaryDocumentFile',
      value: fakeFile,
    });
    await test.runSequence('updateFileDocumentWizardFormValueSequence', {
      key: 'secondaryDocumentFile',
      value: fakeFile,
    });
    await test.runSequence('updateFileDocumentWizardFormValueSequence', {
      key: 'supportingDocuments.0.supportingDocumentFile',
      value: fakeFile,
    });

    await test.runSequence('validateExternalDocumentInformationSequence');
    expect(test.getState('validationErrors')).toEqual({});

    await test.runSequence('addSupportingDocumentToFormSequence', {
      type: 'secondary',
    });

    await test.runSequence('validateExternalDocumentInformationSequence');
    expect(test.getState('validationErrors')).toEqual({
      secondarySupportingDocuments: [
        {
          index: 0,
          supportingDocument: VALIDATION_ERROR_MESSAGES.supportingDocument,
        },
      ],
    });

    await test.runSequence('updateFileDocumentWizardFormValueSequence', {
      key: 'secondarySupportingDocuments.0.category',
      value: 'Supporting Document',
    });
    await test.runSequence('updateFileDocumentWizardFormValueSequence', {
      key: 'secondarySupportingDocuments.0.documentType',
      value: 'Declaration in Support',
    });
    await test.runSequence('updateFileDocumentWizardFormValueSequence', {
      key: 'secondarySupportingDocuments.0.previousDocument',
      value: {
        documentTitle: test.getState('form.secondaryDocument.documentTitle'),
        documentType: test.getState('form.secondaryDocument.documentType'),
      },
    });
    await test.runSequence('updateFileDocumentWizardFormValueSequence', {
      key: 'secondarySupportingDocuments.0.supportingDocument',
      value: 'Declaration in Support',
    });

    await test.runSequence('validateExternalDocumentInformationSequence');
    expect(test.getState('validationErrors')).toEqual({
      secondarySupportingDocuments: [
        {
          index: 0,
          supportingDocumentFile:
            VALIDATION_ERROR_MESSAGES.supportingDocumentFile,
          supportingDocumentFreeText:
            VALIDATION_ERROR_MESSAGES.supportingDocumentFreeText,
        },
      ],
    });

    await test.runSequence('updateFileDocumentWizardFormValueSequence', {
      key: 'secondarySupportingDocuments.0.supportingDocumentFile',
      value: fakeFile,
    });

    await test.runSequence('updateFileDocumentWizardFormValueSequence', {
      key: 'secondarySupportingDocuments.0.supportingDocumentFreeText',
      value: 'Declaration in Support',
    });

    await test.runSequence('reviewExternalDocumentInformationSequence');

    expect(test.getState('validationErrors')).toEqual({});

    await test.runSequence('submitExternalDocumentSequence');
  });
};
