import { CaseAssociationRequestDocumentBase } from '../../../shared/src/business/entities/caseAssociation/CaseAssociationRequestDocumentBase';
import { GENERATION_TYPES } from '@web-client/getConstants';
import { caseDetailHeaderHelper as caseDetailHeaderComputed } from '../../src/presenter/computeds/caseDetailHeaderHelper';
import { externalConsolidatedCaseGroupHelper as externalConsolidatedCaseGroupHelperComputed } from '../../src/presenter/computeds/externalConsolidatedCaseGroupHelper';
import { extractCustomMessages } from '@shared/business/entities/utilities/extractCustomMessages';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '../../src/withAppContext';
const customMessages = extractCustomMessages(
  CaseAssociationRequestDocumentBase,
);

export const irsPractitionerRequestAccessToFileAcrossConsolidatedCasesGroup = (
  cerebralTest,
  { docketNumber, fakeFile },
) => {
  return it('IRS practitioner requests access to consolidated cases group', async () => {
    const caseDetailHeaderHelper = withAppContextDecorator(
      caseDetailHeaderComputed,
    );
    const externalConsolidatedCaseGroupHelper = withAppContextDecorator(
      externalConsolidatedCaseGroupHelperComputed,
    );

    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber,
    });

    const headerHelper = runCompute(caseDetailHeaderHelper, {
      state: cerebralTest.getState(),
    });

    expect(headerHelper.showRequestAccessToCaseButton).toBe(true);

    const docketEntriesBefore = cerebralTest.getState(
      'caseDetail.docketEntries',
    ).length;

    await cerebralTest.runSequence('gotoRequestAccessSequence', {
      docketNumber,
    });

    const formOptionsToSelect = {
      category: 'Appearance and Representation',
      documentTitle: 'Entry of Appearance',
      documentTitleTemplate: 'Entry of Appearance for [Petitioner Names]',
      documentType: 'Entry of Appearance',
      eventCode: 'EA',
      scenario: 'Standard',
    };

    for (const key of Object.keys(formOptionsToSelect)) {
      await cerebralTest.runSequence('updateCaseAssociationFormValueSequence', {
        key,
        value: formOptionsToSelect[key],
      });
    }

    await cerebralTest.runSequence('updateCaseAssociationFormValueSequence', {
      key: 'generationType',
      value: GENERATION_TYPES.MANUAL,
    });

    await cerebralTest.runSequence('updateCaseAssociationFormValueSequence', {
      key: 'certificateOfService',
      value: false,
    });

    await cerebralTest.runSequence('reviewRequestAccessInformationSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({
      primaryDocumentFile: customMessages.primaryDocumentFile[0],
    });

    await cerebralTest.runSequence('updateCaseAssociationFormValueSequence', {
      key: 'primaryDocumentFile',
      value: fakeFile,
    });

    await cerebralTest.runSequence('updateCaseAssociationFormValueSequence', {
      key: 'certificateOfService',
      value: true,
    });

    await cerebralTest.runSequence('validateCaseAssociationRequestSequence');
    expect(cerebralTest.getState('validationErrors')).toEqual({
      certificateOfServiceDate: customMessages.certificateOfServiceDate[0],
    });

    await cerebralTest.runSequence('updateCaseAssociationFormValueSequence', {
      key: 'certificateOfServiceMonth',
      value: '12',
    });
    await cerebralTest.runSequence('updateCaseAssociationFormValueSequence', {
      key: 'certificateOfServiceDay',
      value: '12',
    });
    await cerebralTest.runSequence('updateCaseAssociationFormValueSequence', {
      key: 'certificateOfServiceYear',
      value: '5000',
    });

    await cerebralTest.runSequence('validateCaseAssociationRequestSequence');
    expect(cerebralTest.getState('validationErrors')).toEqual({
      certificateOfServiceDate: customMessages.certificateOfServiceDate[1],
    });

    await cerebralTest.runSequence('updateCaseAssociationFormValueSequence', {
      key: 'certificateOfServiceYear',
      value: '2000',
    });

    await cerebralTest.runSequence('validateCaseAssociationRequestSequence');
    expect(cerebralTest.getState('validationErrors')).toEqual({});

    let externalConsolidatedCasesHelper = runCompute(
      externalConsolidatedCaseGroupHelper,
      {
        state: cerebralTest.getState(),
      },
    );

    expect(
      externalConsolidatedCasesHelper.formattedConsolidatedCaseList.length,
    ).toEqual(4);

    await cerebralTest.runSequence('reviewRequestAccessInformationSequence');

    externalConsolidatedCasesHelper = runCompute(
      externalConsolidatedCaseGroupHelper,
      {
        state: cerebralTest.getState(),
      },
    );

    expect(
      externalConsolidatedCasesHelper.formattedConsolidatedCaseList.length,
    ).toEqual(4);
    expect(
      externalConsolidatedCasesHelper.consolidatedGroupServiceParties.length,
    ).toEqual(4);

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'redactionAcknowledgement',
      value: true,
    });

    await cerebralTest.runSequence('submitCaseAssociationRequestSequence');

    expect(cerebralTest.getState('caseDetail.docketEntries').length).toEqual(
      docketEntriesBefore + 1,
    );
  });
};
