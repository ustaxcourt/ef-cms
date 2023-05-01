import { OBJECTIONS_OPTIONS_MAP } from '../../../shared/src/business/entities/EntityConstants';
import { VALIDATION_ERROR_MESSAGES } from '../../../shared/src/business/entities/externalDocument/ExternalDocumentInformationFactory';
import { contactPrimaryFromState } from '../helpers';
import { fileDocumentHelper } from '../../src/presenter/computeds/fileDocumentHelper';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

export const petitionerFilesAmendedMotion = (cerebralTest, fakeFile) => {
  return it('petitioner files amended motion', async () => {
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    await cerebralTest.runSequence('gotoFileDocumentSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    const amendedMotionFilingDetails = {
      category: 'Miscellaneous',
      documentTitle: '[First, Second, etc.] Amended [Document Name]',
      documentType: 'Amended',
      eventCode: 'AMAT',
      ordinalValue: '1',
      scenario: 'Nonstandard F',
    };

    for (const [key, value] of Object.entries(amendedMotionFilingDetails)) {
      await cerebralTest.runSequence(
        'updateFileDocumentWizardFormValueSequence',
        {
          key,
          value,
        },
      );
    }

    const caseDetail = cerebralTest.getState('caseDetail');
    const previousDocument = caseDetail.docketEntries.find(
      document =>
        document.documentTitle ===
        'Motion for Leave to File Out of Time Statement Anything',
    );
    await cerebralTest.runSequence(
      'updateFileDocumentWizardFormValueSequence',
      {
        key: 'previousDocument',
        value: previousDocument.docketEntryId,
      },
    );

    await cerebralTest.runSequence('completeDocumentSelectSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({});

    expect(cerebralTest.getState('wizardStep')).toEqual('FileDocument');

    await cerebralTest.runSequence(
      'updateFileDocumentWizardFormValueSequence',
      {
        key: 'primaryDocumentFile',
        value: fakeFile,
      },
    );

    await cerebralTest.runSequence(
      'updateFileDocumentWizardFormValueSequence',
      {
        key: 'primaryDocumentFileSize',
        value: 1,
      },
    );

    const contactPrimary = contactPrimaryFromState(cerebralTest);

    await cerebralTest.runSequence(
      'updateFileDocumentWizardFormValueSequence',
      {
        key: `filersMap.${contactPrimary.contactId}`,
        value: true,
      },
    );

    await cerebralTest.runSequence('reviewExternalDocumentInformationSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({
      objections: VALIDATION_ERROR_MESSAGES.objections,
    });

    const helper = runCompute(withAppContextDecorator(fileDocumentHelper), {
      state: cerebralTest.getState(),
    });

    expect(helper.primaryDocument.showObjection).toEqual(true);

    await cerebralTest.runSequence(
      'updateFileDocumentWizardFormValueSequence',
      {
        key: 'objections',
        value: OBJECTIONS_OPTIONS_MAP.NO,
      },
    );

    await cerebralTest.runSequence('reviewExternalDocumentInformationSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({});

    await cerebralTest.runSequence('submitExternalDocumentSequence');
  });
};
