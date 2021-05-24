import { navigateToCaseDetailCaseInformationActionFactory } from './navigateToCaseDetailCaseInformationActionFactory';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';

describe('navigateToCaseDetailCaseInformationActionFactory', () => {
  let routeMock;

  beforeAll(() => {
    routeMock = jest.fn();
    presenter.providers.router = {
      route: routeMock,
    };
  });

  it('should call the router to navigate to the case detail page for the given props.docketNumber', async () => {
    await runAction(navigateToCaseDetailCaseInformationActionFactory(), {
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
    await runAction(navigateToCaseDetailCaseInformationActionFactory(), {
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
    await runAction(navigateToCaseDetailCaseInformationActionFactory(), {
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

  it('should not call the router if docketNumber is not set', async () => {
    await runAction(navigateToCaseDetailCaseInformationActionFactory(), {
      modules: {
        presenter,
      },
      props: {},
      state: {
        caseDetail: {},
      },
    });

    expect(routeMock).not.toHaveBeenCalled();
  });

  it('should call the router to navigate to the case detail page with caseInformationTab in query string when caseInformationTab is passed in', async () => {
    await runAction(
      navigateToCaseDetailCaseInformationActionFactory('parties'),
      {
        modules: {
          presenter,
        },
        props: {
          docketNumber: '123-45',
        },
      },
    );

    expect(routeMock).toHaveBeenCalledWith(
      '/case-detail/123-45/case-information?caseInformationTab=parties',
    );
  });

  it('should navigate to the case-information, parties-tabs, particpants-tab when expected props are passed in', async () => {
    await runAction(
      navigateToCaseDetailCaseInformationActionFactory(
        'parties',
        'participantsAndCounsel',
      ),
      {
        modules: {
          presenter,
        },
        props: {
          docketNumber: '123-45',
        },
      },
    );

    expect(routeMock).toHaveBeenCalledWith(
      '/case-detail/123-45/case-information?caseInformationTab=parties&partiesTab=participantsAndCounsel',
    );
  });
});
