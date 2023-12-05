import { FORMATS } from '@shared/business/utilities/DateHandler';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { caseDetailHeaderHelper as caseDetailHeaderHelperComputed } from '../../src/presenter/computeds/caseDetailHeaderHelper';
import { contactSecondaryFromState } from '../helpers';
import { fileDocumentHelper as fileDocumentHelperComputed } from '../../src/presenter/computeds/fileDocumentHelper';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '../../src/withAppContext';

const caseDetailHeaderHelper = withAppContextDecorator(
  caseDetailHeaderHelperComputed,
);
const fileDocumentHelper = withAppContextDecorator(fileDocumentHelperComputed);

export const respondentFilesFirstIRSDocumentOnCase = (
  cerebralTest,
  fakeFile,
) => {
  const { OBJECTIONS_OPTIONS_MAP } = applicationContext.getConstants();

  return it('Respondent files first IRS document on a case', async () => {
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    const headerHelper = runCompute(caseDetailHeaderHelper, {
      state: cerebralTest.getState(),
    });

    expect(headerHelper.showFileFirstDocumentButton).toBeTruthy();

    await cerebralTest.runSequence('gotoFileDocumentSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    const fileDocHelper = runCompute(fileDocumentHelper, {
      state: cerebralTest.getState(),
    });

    expect(fileDocHelper.showSecondaryParty).toBeTruthy();

    expect(contactSecondaryFromState(cerebralTest).name).toEqual(
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
      await cerebralTest.runSequence(
        'updateFileDocumentWizardFormValueSequence',
        {
          key,
          value: documentToSelect[key],
        },
      );
    }

    await cerebralTest.runSequence('validateSelectDocumentTypeSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({});

    await cerebralTest.runSequence('completeDocumentSelectSequence');

    expect(cerebralTest.getState('form.documentType')).toEqual('Answer');

    expect(cerebralTest.getState('form.partyPrimary')).toEqual(undefined);

    await cerebralTest.runSequence(
      'updateFileDocumentWizardFormValueSequence',
      {
        key: 'certificateOfService',
        value: true,
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
        key: 'attachments',
        value: false,
      },
    );
    await cerebralTest.runSequence(
      'updateFileDocumentWizardFormValueSequence',
      {
        key: 'objections',
        value: OBJECTIONS_OPTIONS_MAP.NO,
      },
    );

    await cerebralTest.runSequence(
      'formatAndUpdateDateFromDatePickerSequence',
      {
        key: 'certificateOfServiceDate',
        toFormat: FORMATS.ISO,
        value: '12/12/2000',
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
        key: 'partyIrsPractitioner',
        value: true,
      },
    );

    await cerebralTest.runSequence('reviewExternalDocumentInformationSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({});

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'redactionAcknowledgement',
      value: true,
    });

    await cerebralTest.runSequence('submitExternalDocumentSequence');
  });
};
