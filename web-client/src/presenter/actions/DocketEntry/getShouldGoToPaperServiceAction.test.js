import {
  CONTACT_TYPES,
  SERVICE_INDICATOR_TYPES,
} from '../../../../../shared/src/business/entities/EntityConstants';
import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { getShouldGoToPaperServiceAction } from './getShouldGoToPaperServiceAction';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';

describe('getShouldGoToPaperServiceAction', () => {
  presenter.providers.applicationContext = applicationContext;

  let noStub;
  let yesStub;

  beforeAll(() => {
    noStub = jest.fn();
    yesStub = jest.fn();

    presenter.providers.path = {
      no: noStub,
      yes: yesStub,
    };
  });

  it('returns path.yes if the case has paper service parties and isSavingForLater is not set', async () => {
    await runAction(getShouldGoToPaperServiceAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          irsPractitioners: [],
          petitioners: [
            {
              contactType: CONTACT_TYPES.primary,
              serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
            },
          ],
          privatePractitioners: [],
        },
      },
    });

    expect(yesStub).toHaveBeenCalled();
  });

  it('returns path.no if the case does NOT have paper service parties and isSavingForLater is not set', async () => {
    await runAction(getShouldGoToPaperServiceAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          irsPractitioners: [],
          petitioners: [
            {
              contactType: CONTACT_TYPES.primary,
              serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
            },
          ],
          privatePractitioners: [],
        },
      },
    });

    expect(noStub).toHaveBeenCalled();
  });

  it('returns path.no if the case has paper service parties and isSavingForLater is true', async () => {
    await runAction(getShouldGoToPaperServiceAction, {
      modules: {
        presenter,
      },
      props: {
        isSavingForLater: true,
      },
      state: {
        caseDetail: {
          irsPractitioners: [],
          petitioners: [
            {
              contactType: CONTACT_TYPES.primary,
              serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
            },
          ],
          privatePractitioners: [],
        },
      },
    });

    expect(noStub).toHaveBeenCalled();
  });

  it('returns path.no if the case does NOT have paper service parties and isSavingForLater is true', async () => {
    await runAction(getShouldGoToPaperServiceAction, {
      modules: {
        presenter,
      },
      props: {
        isSavingForLater: true,
      },
      state: {
        caseDetail: {
          irsPractitioners: [],
          petitioners: [
            {
              contactType: CONTACT_TYPES.primary,
              serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
            },
          ],
          privatePractitioners: [],
        },
      },
    });

    expect(noStub).toHaveBeenCalled();
  });
});
