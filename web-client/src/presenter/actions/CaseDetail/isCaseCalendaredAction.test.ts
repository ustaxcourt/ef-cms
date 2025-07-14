
import { CASE_STATUS_TYPES } from '@shared/business/entities/EntityConstants';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { isCaseCalendaredAction } from './isCaseCalendaredAction';
import { presenter } from '@web-client/presenter/presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('isCaseCalendaredAction', () => {
  const mockYesPath = jest.fn();
  const mockNoPath = jest.fn();

  presenter.providers.path = {
    yes: mockYesPath,
    no: mockNoPath,
  };

  presenter.providers.applicationContext = applicationContext;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should use yes path when case status is calendared', async () => {
    await runAction(isCaseCalendaredAction, {
      modules: {
        presenter,
      },
      props: {
        caseDetail: {
          status: CASE_STATUS_TYPES.calendared,
        },
      },
    });

    expect(mockYesPath).toHaveBeenCalled();
    expect(mockNoPath).not.toHaveBeenCalled();
  });
  it('should use no path when caseDetail.status is not calendared', async () => {
    await runAction(isCaseCalendaredAction, {
      modules: {
        presenter,
      },
      props: {
        caseDetail: {
          status: 'abc',
        },
      },
    });

    expect(mockNoPath).toHaveBeenCalled();
    expect(mockYesPath).not.toHaveBeenCalled();
  });
  it('should use no path when caseDetail.status is undefined', async () => {
    await runAction(isCaseCalendaredAction, {
      modules: {
        presenter,
      },
      props: {
        caseDetail: {},
      },
    });

    expect(mockNoPath).toHaveBeenCalled();
    expect(mockYesPath).not.toHaveBeenCalled();
  });
});