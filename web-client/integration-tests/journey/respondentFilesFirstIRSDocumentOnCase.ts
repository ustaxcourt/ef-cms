import { OBJECTIONS_OPTIONS_MAP } from '../../../shared/src/business/entities/EntityConstants';
import { caseDetailHeaderHelper as caseDetailHeaderHelperComputed } from '../../src/presenter/computeds/caseDetailHeaderHelper';
import { contactSecondaryFromState } from '../helpers';
import { fileDocumentHelper as fileDocumentHelperComputed } from '../../src/presenter/computeds/fileDocumentHelper';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

export const respondentFilesFirstIRSDocumentOnCase = (
  cerebralTest,
  fakeFile,
) => {
  const caseDetailHeaderHelper = withAppContextDecorator(
    caseDetailHeaderHelperComputed,
  );
  const fileDocumentHelper = withAppContextDecorator(
    fileDocumentHelperComputed,
  );

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

    for (const [key, value] of Object.entries(documentToSelect)) {
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

    expect(cerebralTest.getState('form.documentType')).toEqual('Answer');
    expect(cerebralTest.getState('form.partyPrimary')).toEqual(undefined);

    const filingDetails = {
      attachments: false,
      certificateOfService: true,
      certificateOfServiceDay: '12',
      certificateOfServiceMonth: '12',
      certificateOfServiceYear: '2000',
      hasSupportingDocuments: false,
      objections: OBJECTIONS_OPTIONS_MAP.NO,
      partyIrsPractitioner: true,
      primaryDocumentFile: fakeFile,
      primaryDocumentFileSize: 1,
    };

    for (const [key, value] of Object.entries(filingDetails)) {
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
