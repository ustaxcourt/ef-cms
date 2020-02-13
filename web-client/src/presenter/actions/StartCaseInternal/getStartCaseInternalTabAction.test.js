import { getStartCaseInternalTabAction } from './getStartCaseInternalTabAction';
import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';

describe('getStartCaseInternalTabAction', () => {
  let pathCaseInfoStub;

  beforeEach(() => {
    pathCaseInfoStub = jest.fn();

    presenter.providers.path = {
      caseInfo: pathCaseInfoStub,
    };
  });

  it('calls the caseInfo path if the caseInfo tab is clicked', async () => {
    await runAction(getStartCaseInternalTabAction, {
      modules: {
        presenter,
      },
      props: {
        tab: 'caseInfo',
      },
    });

    expect(pathCaseInfoStub).toHaveBeenCalled();
  });

  it('does not call the caseInfo path if the caseInfo tab is not clicked', async () => {
    await runAction(getStartCaseInternalTabAction, {
      modules: {
        presenter,
      },
      props: {
        tab: 'parties',
      },
    });

    expect(pathCaseInfoStub).not.toHaveBeenCalled();
  });
});
