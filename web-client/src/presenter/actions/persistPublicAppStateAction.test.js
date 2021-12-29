import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { persistPublicAppStateAction } from './persistPublicAppStateAction';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';

describe('persistPublicAppStateAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('should call the setItemInteractor to persists the tab and form', async () => {
    await runAction(persistPublicAppStateAction, {
      modules: {
        presenter,
      },
      state: {
        advancedSearchForm: {
          caseSearchByDocketNumber: {},
          caseSearchByName: { countryType: 'domestic' },
          currentPage: 1,
          opinionSearch: {
            opinionTypes: { MOP: true, OST: true, SOP: true, TCOP: true },
          },
          orderSearch: { keyword: 'test' },
          practitionerSearchByBarNumber: {},
          practitionerSearchByName: {},
          searchMode: 'byName',
        },
        advancedSearchTab: 'order',
      },
    });

    expect(
      applicationContext.getUseCases().setItemInteractor,
    ).toHaveBeenNthCalledWith(1, expect.anything(), {
      key: 'advancedSearchTab',
      value: 'order',
    });
    expect(
      applicationContext.getUseCases().setItemInteractor,
    ).toHaveBeenNthCalledWith(2, expect.anything(), {
      key: 'advancedSearchForm',
      value: {
        caseSearchByDocketNumber: {},
        caseSearchByName: { countryType: 'domestic' },
        currentPage: 1,
        opinionSearch: {
          opinionTypes: { MOP: true, OST: true, SOP: true, TCOP: true },
        },
        orderSearch: { keyword: 'test' },
        practitionerSearchByBarNumber: {},
        practitionerSearchByName: {},
        searchMode: 'byName',
      },
    });
  });
});
