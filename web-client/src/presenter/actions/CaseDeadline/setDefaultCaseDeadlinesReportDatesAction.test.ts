import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { setDefaultCaseDeadlinesReportDatesAction } from './setDefaultCaseDeadlinesReportDatesAction';

describe('setDefaultCaseDeadlinesReportDatesAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;

    applicationContext.getUtilities().deconstructDate.mockReturnValue({
      day: '01',
      month: '01',
      year: '2020',
    });
  });

  it('sets only state.screenMetadata.filterStartDate to the formatted props.startDate if props.endDate is not passed in', async () => {
    const result = await runAction(setDefaultCaseDeadlinesReportDatesAction, {
      modules: { presenter },
      state: {
        screenMetadata: {},
      },
    });

    expect(result.state.screenMetadata.filterStartDate).toEqual(
      '2020-01-01T05:00:00.000Z',
    );
    expect(result.state.screenMetadata.filterEndDate).toEqual(
      '2020-01-02T04:59:59.999Z',
    );
  });
});
