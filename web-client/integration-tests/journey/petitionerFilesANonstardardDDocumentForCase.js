import { contactPrimaryFromState } from '../helpers';
import { formattedCaseDetail } from '../../src/presenter/computeds/formattedCaseDetail';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

export const petitionerFilesANonstardardDDocumentForCase = (test, fakeFile) => {
  return it('Petitioner files a nonstandard d document for case', async () => {
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });

    await test.runSequence('gotoFileDocumentSequence', {
      docketNumber: test.docketNumber,
    });

    const documentToSelect = {
      category: 'Miscellaneous',
      documentTitle: 'Certificate of Service of [Document Name] [Date]',
      documentType: 'Certificate of Service',
      eventCode: 'CS',
      scenario: 'Nonstandard D',
    };

    for (const key of Object.keys(documentToSelect)) {
      await test.runSequence('updateFileDocumentWizardFormValueSequence', {
        key,
        value: documentToSelect[key],
      });
    }

    await test.runSequence('updateFileDocumentWizardFormValueSequence', {
      key: 'certificateOfService',
      value: false,
    });

    await test.runSequence('updateFileDocumentWizardFormValueSequence', {
      key: 'hasSupportingDocuments',
      value: false,
    });

    await test.runSequence('updateFileDocumentWizardFormValueSequence', {
      key: 'primaryDocumentFile',
      value: fakeFile,
    });

    await test.runSequence('updateFileDocumentWizardFormValueSequence', {
      key: 'serviceDateMonth',
      value: '03',
    });

    await test.runSequence('updateFileDocumentWizardFormValueSequence', {
      key: 'serviceDateDay',
      value: '03',
    });

    await test.runSequence('updateFileDocumentWizardFormValueSequence', {
      key: 'serviceDateYear',
      value: '2003',
    });

    await test.runSequence('updateFileDocumentWizardFormValueSequence', {
      key: 'previousDocument',
      value: test.previousDocumentId,
    });

    await test.runSequence('validateSelectDocumentTypeSequence');

    expect(test.getState('validationErrors')).toEqual({});

    await test.runSequence('completeDocumentSelectSequence');

    expect(test.getState('form.documentType')).toEqual(
      'Certificate of Service',
    );

    runCompute(withAppContextDecorator(formattedCaseDetail), {
      state: test.getState(),
    });

    const contactPrimary = contactPrimaryFromState(test);

    await test.runSequence('updateFileDocumentWizardFormValueSequence', {
      key: `filersMap.${contactPrimary.contactId}`,
      value: true,
    });

    await test.runSequence('reviewExternalDocumentInformationSequence');

    expect(test.getState('validationErrors')).toEqual({});

    await test.runSequence('submitExternalDocumentSequence');
  });
};
