import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';
import { shouldSetupConsolidatedCasesAction } from './shouldSetupConsolidatedCasesAction';

describe('shouldSetupConsolidatedCasesAction', () => {
  let pathYesStub;
  let pathNoStub;

  beforeAll(() => {
    pathYesStub = jest.fn();
    pathNoStub = jest.fn();

    presenter.providers.applicationContext = applicationContext;

    presenter.providers.path = {
      no: pathNoStub,
      yes: pathYesStub,
    };
  });

  it('should return the no path when showConsolidatedCasesForService is false', async () => {
    await runAction(shouldSetupConsolidatedCasesAction, {
      modules: {
        presenter,
      },
      state: {
        confirmInitiateServiceModalHelper: {
          showConsolidatedCasesForService: false,
        },
      },
    });

    expect(pathNoStub).toHaveBeenCalled();
  });

  it('should return the yes path when showConsolidatedCasesForService is true', async () => {
    await runAction(shouldSetupConsolidatedCasesAction, {
      modules: {
        presenter,
      },
      state: {
        confirmInitiateServiceModalHelper: {
          showConsolidatedCasesForService: true,
        },
      },
    });

    expect(pathYesStub).toHaveBeenCalled();
  });
});
