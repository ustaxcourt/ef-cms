import { FORMATS } from '../../../../../shared/src/business/utilities/DateHandler';
import { applicationContextForClient } from '@web-client/test/createClientTestApplicationContext';
import { defaultCaseSearchDatesAction } from './defaultCaseSearchDatesAction';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('defaultCaseSearchDatesAction', () => {
  presenter.providers.applicationContext = applicationContextForClient;

  it('should set default startDate of "05/01/1986" on advancedSearchForm.caseSearchByName if an endDate is provided', async () => {
    const result = await runAction(defaultCaseSearchDatesAction, {
      modules: { presenter },
      state: {
        advancedSearchForm: {
          caseSearchByName: {
            endDate: '11/12/2020',
          },
        },
      },
    });

    expect(result.state.advancedSearchForm.caseSearchByName).toMatchObject({
      endDate: '11/12/2020',
      startDate: '05/01/1986',
    });
  });

  it('should set default endDate to today on advancedSearchForm.caseSearchByName if a startDate is provided', async () => {
    const result = await runAction(defaultCaseSearchDatesAction, {
      modules: { presenter },
      state: {
        advancedSearchForm: {
          caseSearchByName: {
            startDate: '11/12/2020',
          },
        },
      },
    });

    expect(result.state.advancedSearchForm.caseSearchByName).toMatchObject({
      endDate: applicationContextForClient
        .getUtilities()
        .formatNow(FORMATS.MMDDYYYY),
      startDate: '11/12/2020',
    });
  });
});
