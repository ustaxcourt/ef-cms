import { CerebralTest } from 'cerebral/test';
import {
  DEFAULT_PROCEDURE_TYPE,
  ROLES,
} from '../../../../shared/src/business/entities/EntityConstants';
import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { gotoStartCaseWizardSequence } from '../sequences/gotoStartCaseWizardSequence';
import { presenter } from '../presenter-mock';

describe('gotoStartCaseWizardSequence', () => {
  let test;

  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
    presenter.sequences = {
      gotoStartCaseWizardSequence,
    };
    test = CerebralTest(presenter);
  });

  it('should set up state for an internal user going to start case form', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.petitionsClerk,
    });

    await test.runSequence('gotoStartCaseWizardSequence');

    expect(test.getState()).toMatchObject({
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
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.petitioner,
    });

    await test.runSequence('gotoStartCaseWizardSequence');

    expect(test.getState()).toMatchObject({
      currentPage: 'StartCaseWizard',
      form: {
        contactPrimary: {},
        wizardStep: undefined,
      },
      wizardStep: undefined,
    });
  });
});
