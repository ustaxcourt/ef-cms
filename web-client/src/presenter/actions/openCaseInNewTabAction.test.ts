import { openCaseInNewTabAction } from './openCaseInNewTabAction';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('openCaseInNewTabAction', () => {
  beforeAll(() => {
    window.open = jest.fn();
  });

  it('calls window.open with a blank tab for the given props.docketNumber', async () => {
    await runAction(openCaseInNewTabAction, {
      props: {
        docketNumber: '123-45',
      },
    });

    expect(window.open).toHaveBeenCalledWith('/case-detail/123-45', '_blank');
  });

  it('calls window.open with a blank tab for the current case on state', async () => {
    await runAction(openCaseInNewTabAction, {
      state: {
        caseDetail: {
          docketNumber: '234-56',
        },
      },
    });

    expect(window.open).toHaveBeenCalledWith('/case-detail/234-56', '_blank');
  });
});
