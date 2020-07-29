import { navigateToCaseDetailCaseInformationAction } from './navigateToCaseDetailCaseInformationAction';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';

describe('navigateToCaseDetailCaseInformationAction', () => {
  let routeMock;

  beforeAll(() => {
    routeMock = jest.fn();
    presenter.providers.router = {
      route: routeMock,
    };
  });

  it('should call the router to navigate to the case detail page for the given props.docketNumber', async () => {
    await runAction(navigateToCaseDetailCaseInformationAction, {
      modules: {
        presenter,
      },
      props: {
        docketNumber: '123-45',
      },
    });

    expect(routeMock).toHaveBeenCalledWith(
      '/case-detail/123-45/case-information',
    );
  });

  it('should call the router to navigate to the case detail page for the given props.caseDetail.caaseId', async () => {
    await runAction(navigateToCaseDetailCaseInformationAction, {
      modules: {
        presenter,
      },
      props: {
        caseDetail: {
          docketNumber: '123-45',
        },
      },
    });

    expect(routeMock).toHaveBeenCalledWith(
      '/case-detail/123-45/case-information',
    );
  });

  it('should call the router to navigate to the case detail page for the given state.caseDetail.docketNumber', async () => {
    await runAction(navigateToCaseDetailCaseInformationAction, {
      modules: {
        presenter,
      },
      props: {},
      state: {
        caseDetail: {
          docketNumber: '123-45',
        },
      },
    });

    expect(routeMock).toHaveBeenCalledWith(
      '/case-detail/123-45/case-information',
    );
  });
});
