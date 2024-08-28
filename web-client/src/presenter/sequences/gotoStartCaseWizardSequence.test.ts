import { CerebralTest } from 'cerebral/test';
import { DEFAULT_PROCEDURE_TYPE } from '../../../../shared/src/business/entities/EntityConstants';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { gotoStartCaseWizardSequence } from '../sequences/gotoStartCaseWizardSequence';
import { petitionerUser, petitionsClerkUser } from '@shared/test/mockUsers';
import { presenter } from '../presenter-mock';

describe('gotoStartCaseWizardSequence', () => {
  let cerebralTest;

  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
    presenter.sequences = {
      gotoStartCaseWizardSequence,
    };
    cerebralTest = CerebralTest(presenter);
  });

  it('should set up state for an internal user going to start case form', async () => {
    cerebralTest.setState('user', petitionsClerkUser);

    await cerebralTest.runSequence('gotoStartCaseWizardSequence');

    expect(cerebralTest.getState()).toMatchObject({
      currentPage: 'StartCaseInternal',
      currentViewMetadata: {
        documentSelectedForScan: 'petitionFile',
        documentUploadMode: 'scan',
        startCaseInternal: {
          tab: 'partyInfo',
        },
      },
      form: {
        hasVerifiedIrsNotice: false,
        orderDesignatingPlaceOfTrial: true,
        procedureType: DEFAULT_PROCEDURE_TYPE,
        statistics: [],
      },
    });
  });

  it('should set up state for an external user going to start case form', async () => {
    cerebralTest.setState('user', petitionerUser);

    await cerebralTest.runSequence('gotoStartCaseWizardSequence');

    const endState = cerebralTest.getState();
    expect(endState).toMatchObject({
      currentPage: 'StartCaseWizard',
      form: {
        contactPrimary: {},
      },
    });
    expect(endState.form.wizardStep).toBeUndefined();
    expect(endState.wizardStep).toBeUndefined();
  });
});
