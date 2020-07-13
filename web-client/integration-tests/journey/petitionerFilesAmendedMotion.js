import { VALIDATION_ERROR_MESSAGES } from '../../../shared/src/business/entities/externalDocument/ExternalDocumentInformationFactory';
import { fileDocumentHelper } from '../../src/presenter/computeds/fileDocumentHelper';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

export const petitionerFilesAmendedMotion = (test, fakeFile) => {
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
    const previousDocument = caseDetail.documents.find(
      document =>
        document.documentTitle ===
        'Motion for Leave to File Out of Time Statement Anything',
    );
    await test.runSequence('updateFileDocumentWizardFormValueSequence', {
      key: 'previousDocument',
      value: previousDocument.documentId,
    });

    await test.runSequence('completeDocumentSelectSequence');

    expect(test.getState('validationErrors')).toEqual({});

    expect(test.getState('wizardStep')).toEqual('FileDocument');

    await test.runSequence('updateFileDocumentWizardFormValueSequence', {
      key: 'primaryDocumentFile',
      value: fakeFile,
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
      value: 'No',
    });

    await test.runSequence('reviewExternalDocumentInformationSequence');

    expect(test.getState('validationErrors')).toEqual({});

    await test.runSequence('submitExternalDocumentSequence');
  });
};
