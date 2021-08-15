import { contactPrimaryFromState } from '../helpers';
import { formattedCaseDetail } from '../../src/presenter/computeds/formattedCaseDetail';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

export const petitionerFilesANonstardardDDocumentForCase = (
  cerebralTest,
  fakeFile,
) => {
  return it('Petitioner files a nonstandard d document for case', async () => {
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    await cerebralTest.runSequence('gotoFileDocumentSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    const documentToSelect = {
      category: 'Miscellaneous',
      documentTitle: 'Certificate of Service of [Document Name] [Date]',
      documentType: 'Certificate of Service',
      eventCode: 'CS',
      scenario: 'Nonstandard D',
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

    await cerebralTest.runSequence(
      'updateFileDocumentWizardFormValueSequence',
      {
        key: 'certificateOfService',
        value: false,
      },
    );

    await cerebralTest.runSequence(
      'updateFileDocumentWizardFormValueSequence',
      {
        key: 'hasSupportingDocuments',
        value: false,
      },
    );

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
        key: 'serviceDateMonth',
        value: '03',
      },
    );

    await cerebralTest.runSequence(
      'updateFileDocumentWizardFormValueSequence',
      {
        key: 'serviceDateDay',
        value: '03',
      },
    );

    await cerebralTest.runSequence(
      'updateFileDocumentWizardFormValueSequence',
      {
        key: 'serviceDateYear',
        value: '2003',
      },
    );

    await cerebralTest.runSequence(
      'updateFileDocumentWizardFormValueSequence',
      {
        key: 'previousDocument',
        value: cerebralTest.previousDocumentId,
      },
    );

    await cerebralTest.runSequence('validateSelectDocumentTypeSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({});

    await cerebralTest.runSequence('completeDocumentSelectSequence');

    expect(cerebralTest.getState('form.documentType')).toEqual(
      'Certificate of Service',
    );

    runCompute(withAppContextDecorator(formattedCaseDetail), {
      state: cerebralTest.getState(),
    });

    const contactPrimary = contactPrimaryFromState(cerebralTest);

    await cerebralTest.runSequence(
      'updateFileDocumentWizardFormValueSequence',
      {
        key: `filersMap.${contactPrimary.contactId}`,
        value: true,
      },
    );

    await cerebralTest.runSequence('reviewExternalDocumentInformationSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({});

    await cerebralTest.runSequence('submitExternalDocumentSequence');
  });
};
