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

    const { contactId } = contactPrimaryFromState(cerebralTest);
    const filingDocumentDetails = {
      [`filersMap.${contactId}`]: true,
      category: 'Miscellaneous',
      certificateOfService: false,
      documentTitle: 'Certificate of Service of [Document Name] [Date]',
      documentType: 'Certificate of Service',
      eventCode: 'CS',
      hasSupportingDocuments: false,
      previousDocument: cerebralTest.previousDocumentId,
      primaryDocumentFile: fakeFile,
      primaryDocumentFileSize: 1,
      scenario: 'Nonstandard D',
      serviceDateDay: '03',
      serviceDateMonth: '03',
      serviceDateYear: '2003',
    };

    for (const [key, value] of Object.entries(filingDocumentDetails)) {
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
      'Certificate of Service',
    );

    runCompute(withAppContextDecorator(formattedCaseDetail), {
      state: cerebralTest.getState(),
    });

    await cerebralTest.runSequence('reviewExternalDocumentInformationSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({});

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'redactionAcknowledgement',
      value: true,
    });

    await cerebralTest.runSequence('submitExternalDocumentSequence');
  });
};
