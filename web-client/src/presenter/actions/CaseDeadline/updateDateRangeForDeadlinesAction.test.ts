import { applicationContextForClient } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { updateDateRangeForDeadlinesAction } from './updateDateRangeForDeadlinesAction';

describe('updateDateRangeForDeadlinesAction', () => {
  const mockStartDate = '04/20/2019';
  const mockEndDate = '02/05/2021';

  presenter.providers.applicationContext = applicationContextForClient;

  it('should compute and set screenMetadata.filterStartDate and screenMetadata.filterEndDate from screenMetadata', async () => {
    const result = await runAction(updateDateRangeForDeadlinesAction, {
      modules: { presenter },
      state: {
        screenMetadata: {
          filterEndDateState: mockEndDate,
          filterStartDateState: mockStartDate,
        },
      },
    });

    expect(result.state.screenMetadata.filterStartDate).toEqual(
      '2019-04-20T04:00:00.000Z',
    );
    expect(result.state.screenMetadata.filterEndDate).toEqual(
      '2021-02-06T04:59:59.999Z',
    );
  });

  it('should set screenMetadata.filterStartDateState and screenMetadata.filterEndDateState to empty strings', async () => {
    const result = await runAction(updateDateRangeForDeadlinesAction, {
      modules: { presenter },
      state: {
        screenMetadata: {
          filterEndDateState: mockEndDate,
          filterStartDateState: mockStartDate,
        },
      },
    });

    expect(result.state.screenMetadata.filterStartDateState).toEqual('');
    expect(result.state.screenMetadata.filterEndDateState).toEqual('');
  });
});
