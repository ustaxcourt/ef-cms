import { VALIDATION_ERROR_MESSAGES } from '../../../shared/src/business/entities/externalDocument/ExternalDocumentInformationFactory';
import { applicationContextForClient as applicationContext } from '../../../shared/src/business/test/createTestApplicationContext';
import { contactPrimaryFromState } from '../helpers';
import { fileDocumentHelper } from '../../src/presenter/computeds/fileDocumentHelper';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

export const petitionerFilesAmendedMotion = (test, fakeFile) => {
  const { OBJECTIONS_OPTIONS_MAP } = applicationContext.getConstants();

  return it('petitioner files amended motion', async () => {
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });

    await test.runSequence('gotoFileDocumentSequence', {
      docketNumber: test.docketNumber,
    });

    await test.runSequence('updateFileDocumentWizardFormValueSequence', {
      key: 'category',
      value: 'Miscellaneous',
    });

    await test.runSequence('updateFileDocumentWizardFormValueSequence', {
      key: 'documentType',
      value: 'Amended',
    });
    await test.runSequence('updateFileDocumentWizardFormValueSequence', {
      key: 'documentTitle',
      value: '[First, Second, etc.] Amended [Document Name]',
    });
    await test.runSequence('updateFileDocumentWizardFormValueSequence', {
      key: 'eventCode',
      value: 'AMAT',
    });
    await test.runSequence('updateFileDocumentWizardFormValueSequence', {
      key: 'scenario',
      value: 'Nonstandard F',
    });

    await test.runSequence('updateFileDocumentWizardFormValueSequence', {
      key: 'ordinalValue',
      value: 'First',
    });
    const caseDetail = test.getState('caseDetail');
    const previousDocument = caseDetail.docketEntries.find(
      document =>
        document.documentTitle ===
        'Motion for Leave to File Out of Time Statement Anything',
    );
    await test.runSequence('updateFileDocumentWizardFormValueSequence', {
      key: 'previousDocument',
      value: previousDocument.docketEntryId,
    });

    await test.runSequence('completeDocumentSelectSequence');

    expect(test.getState('validationErrors')).toEqual({});

    expect(test.getState('wizardStep')).toEqual('FileDocument');

    await test.runSequence('updateFileDocumentWizardFormValueSequence', {
      key: 'primaryDocumentFile',
      value: fakeFile,
    });

    const contactPrimary = contactPrimaryFromState(test);

    await test.runSequence('updateFileDocumentWizardFormValueSequence', {
      key: `filersMap.${contactPrimary.contactId}`,
      value: true,
    });

    await test.runSequence('reviewExternalDocumentInformationSequence');

    expect(test.getState('validationErrors')).toEqual({
      objections: VALIDATION_ERROR_MESSAGES.objections,
    });

    const helper = runCompute(withAppContextDecorator(fileDocumentHelper), {
      state: test.getState(),
    });

    expect(helper.primaryDocument.showObjection).toEqual(true);

    await test.runSequence('updateFileDocumentWizardFormValueSequence', {
      key: 'objections',
      value: OBJECTIONS_OPTIONS_MAP.NO,
    });

    await test.runSequence('reviewExternalDocumentInformationSequence');

    expect(test.getState('validationErrors')).toEqual({});

    await test.runSequence('submitExternalDocumentSequence');
  });
};
