import { OBJECTIONS_OPTIONS_MAP } from '../../../shared/src/business/entities/EntityConstants';
import { contactPrimaryFromState } from '../helpers';

export const petitionerFilesApplicationToTakeDeposition = (
  cerebralTest,
  fakeFile,
) => {
  return it('Petitioner files an application to take deposition', async () => {
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    await cerebralTest.runSequence('gotoFileDocumentSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    const documentToSelect = {
      category: 'Application',
      documentTitle: 'Application to Take Deposition of [Name]',
      documentType: 'Application to Take Deposition',
      eventCode: 'APLD',
      scenario: 'Nonstandard B',
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

    await cerebralTest.runSequence('completeDocumentSelectSequence');

    expect(cerebralTest.getState('form.documentType')).toEqual(
      documentToSelect.documentType,
    );

    const { contactId } = contactPrimaryFromState(cerebralTest);
    const documentDetails = {
      certificateOfService: false,
      hasSupportingDocuments: false,
      [`filersMap.${contactId}`]: true,
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

    await cerebralTest.runSequence('reviewExternalDocumentInformationSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({});

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'redactionAcknowledgement',
      value: true,
    });

    await cerebralTest.runSequence('submitExternalDocumentSequence');
  });
};
