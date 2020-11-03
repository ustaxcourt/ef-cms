import { applicationContextForClient as applicationContext } from '../../../shared/src/business/test/createTestApplicationContext';
import { caseDetailHeaderHelper as caseDetailHeaderHelperComputed } from '../../src/presenter/computeds/caseDetailHeaderHelper';
import { fileDocumentHelper as fileDocumentHelperComputed } from '../../src/presenter/computeds/fileDocumentHelper';
import { formattedCaseDetail as formattedCaseDetailComputed } from '../../src/presenter/computeds/formattedCaseDetail';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

const caseDetailHeaderHelper = withAppContextDecorator(
  caseDetailHeaderHelperComputed,
);
const fileDocumentHelper = withAppContextDecorator(fileDocumentHelperComputed);
const formattedCaseDetail = withAppContextDecorator(
  formattedCaseDetailComputed,
);

export const respondentFilesFirstIRSDocumentOnCase = (test, fakeFile) => {
  const { OBJECTIONS_OPTIONS_MAP } = applicationContext.getConstants();

  return it('Respondent files first IRS document on a case', async () => {
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });

    const headerHelper = runCompute(caseDetailHeaderHelper, {
      state: test.getState(),
    });

    expect(headerHelper.showFileFirstDocumentButton).toBeTruthy();

    await test.runSequence('gotoFileDocumentSequence', {
      docketNumber: test.docketNumber,
    });

    const fileDocHelper = runCompute(fileDocumentHelper, {
      state: test.getState(),
    });

    expect(fileDocHelper.showSecondaryParty).toBeTruthy();

    const caseDetailFormatted = runCompute(formattedCaseDetail, {
      state: test.getState(),
    });

    expect(caseDetailFormatted.contactSecondary.name).toEqual(
      'Jimothy Schultz',
    );

    const documentToSelect = {
      category: 'Answer (filed by respondent only)',
      documentTitle: 'Answer',
      documentType: 'Answer',
      eventCode: 'A',
      scenario: 'Standard',
    };

    for (const key of Object.keys(documentToSelect)) {
      await test.runSequence('updateFileDocumentWizardFormValueSequence', {
        key,
        value: documentToSelect[key],
      });
    }

    await test.runSequence('validateSelectDocumentTypeSequence');

    expect(test.getState('validationErrors')).toEqual({});

    await test.runSequence('completeDocumentSelectSequence');

    expect(test.getState('form.documentType')).toEqual('Answer');

    expect(test.getState('form.partyPrimary')).toEqual(undefined);

    await test.runSequence('updateFileDocumentWizardFormValueSequence', {
      key: 'certificateOfService',
      value: true,
    });

    await test.runSequence('updateFileDocumentWizardFormValueSequence', {
      key: 'hasSupportingDocuments',
      value: false,
    });

    await test.runSequence('updateFileDocumentWizardFormValueSequence', {
      key: 'attachments',
      value: false,
    });
    await test.runSequence('updateFileDocumentWizardFormValueSequence', {
      key: 'objections',
      value: OBJECTIONS_OPTIONS_MAP.NO,
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
      value: '2000',
    });

    await test.runSequence('updateFileDocumentWizardFormValueSequence', {
      key: 'primaryDocumentFile',
      value: fakeFile,
    });

    await test.runSequence('updateFileDocumentWizardFormValueSequence', {
      key: 'partyIrsPractitioner',
      value: true,
    });

    await test.runSequence('reviewExternalDocumentInformationSequence');

    expect(test.getState('validationErrors')).toEqual({});

    await test.runSequence('submitExternalDocumentSequence');
  });
};
