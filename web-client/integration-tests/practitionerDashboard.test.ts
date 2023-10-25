import { FORMATS } from '@shared/business/utilities/DateHandler';
import {
  contactPrimaryFromState,
  fakeFile,
  loginAs,
  setupTest,
} from './helpers';
import { createConsolidatedGroup } from './journey/consolidation/createConsolidatedGroup';
import { externalUserCasesHelper } from '@web-client/presenter/computeds/Dashboard/externalUserCasesHelper';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '@web-client/withAppContext';

describe('Practitioner Dashboard', () => {
  const cerebralTest = setupTest();
  const externalUserCasesComputed = withAppContextDecorator(
    externalUserCasesHelper,
  );

  let openCaseCountBeforeAssociation: number;

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  loginAs(cerebralTest, 'privatepractitioner1@example.com');
  it('get open case count before association', async () => {
    await cerebralTest.runSequence('gotoDashboardSequence');

    openCaseCountBeforeAssociation = runCompute(externalUserCasesComputed, {
      state: cerebralTest.getState(),
    }).openCasesCount;
  });

  createConsolidatedGroup(cerebralTest, {}, 2);

  loginAs(cerebralTest, 'privatepractitioner1@example.com');

  it('Practitioner requests access to 2 cases', async () => {
    for (let i = 0; i < 2; i++) {
      const docketNumberToAssociateWith =
        cerebralTest.consolidatedCasesThatShouldReceiveDocketEntries[i];

      await cerebralTest.runSequence('gotoCaseDetailSequence', {
        docketNumber: docketNumberToAssociateWith,
      });

      await cerebralTest.runSequence('gotoRequestAccessSequence', {
        docketNumber: docketNumberToAssociateWith,
      });

      await cerebralTest.runSequence('reviewRequestAccessInformationSequence');

      await cerebralTest.runSequence('updateCaseAssociationFormValueSequence', {
        key: 'documentType',
        value: 'Limited Entry of Appearance',
      });
      await cerebralTest.runSequence('updateCaseAssociationFormValueSequence', {
        key: 'documentTitleTemplate',
        value: 'Limited Entry of Appearance for [Petitioner Names]',
      });
      await cerebralTest.runSequence('updateCaseAssociationFormValueSequence', {
        key: 'eventCode',
        value: 'LEA',
      });
      await cerebralTest.runSequence('updateCaseAssociationFormValueSequence', {
        key: 'scenario',
        value: 'Standard',
      });

      await cerebralTest.runSequence('updateCaseAssociationFormValueSequence', {
        key: 'primaryDocumentFile',
        value: fakeFile,
      });

      await cerebralTest.runSequence('updateCaseAssociationFormValueSequence', {
        key: 'certificateOfService',
        value: true,
      });

      await cerebralTest.runSequence(
        'formatAndUpdateDateFromDatePickerSequence',
        {
          key: 'certificateOfServiceDate',
          toFormat: FORMATS.ISO,
          value: '12/12/2000',
        },
      );

      const contactPrimary = contactPrimaryFromState(cerebralTest);
      await cerebralTest.runSequence('updateCaseAssociationFormValueSequence', {
        key: `filersMap.${contactPrimary.contactId}`,
        value: true,
      });

      await cerebralTest.runSequence('reviewRequestAccessInformationSequence');
      await cerebralTest.runSequence('submitCaseAssociationRequestSequence');
    }
  });

  it('Private practitioner gets a count of cases that they are directly associated with', async () => {
    await cerebralTest.runSequence('gotoDashboardSequence');

    const openCaseCountAfterAssociation: number = runCompute(
      externalUserCasesComputed,
      {
        state: cerebralTest.getState(),
      },
    ).openCasesCount;

    expect(openCaseCountAfterAssociation).toBe(
      openCaseCountBeforeAssociation + 2,
    );
  });
});
