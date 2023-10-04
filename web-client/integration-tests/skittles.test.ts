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

describe('Skittles', () => {
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

  // Create a consolidated group (3 cases)
  createConsolidatedGroup(cerebralTest, {}, 2);

  // associate private_practitioner_1 with 1 case in the group
  loginAs(cerebralTest, 'privatepractitioner1@example.com');
  // practitionerRequestsAccessToCaseManual(cerebralTest, fakeFile);
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

      await cerebralTest.runSequence('validateCaseAssociationRequestSequence'); // may not need it

      await cerebralTest.runSequence('updateCaseAssociationFormValueSequence', {
        key: 'primaryDocumentFile',
        value: fakeFile,
      });

      await cerebralTest.runSequence('validateCaseAssociationRequestSequence');

      await cerebralTest.runSequence('updateCaseAssociationFormValueSequence', {
        key: 'certificateOfService',
        value: true,
      });

      await cerebralTest.runSequence('validateCaseAssociationRequestSequence');

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

      await cerebralTest.runSequence('updateCaseAssociationFormValueSequence', {
        key: 'certificateOfServiceYear',
        value: '2000',
      });

      await cerebralTest.runSequence('validateCaseAssociationRequestSequence');

      const contactPrimary = contactPrimaryFromState(cerebralTest);
      await cerebralTest.runSequence('updateCaseAssociationFormValueSequence', {
        key: `filersMap.${contactPrimary.contactId}`,
        value: true,
      });

      await cerebralTest.runSequence('validateCaseAssociationRequestSequence');
      await cerebralTest.runSequence('reviewRequestAccessInformationSequence');
      await cerebralTest.runSequence('submitCaseAssociationRequestSequence');
    }
  });

  // login as a private practitioner and expect open cases to be 2
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
