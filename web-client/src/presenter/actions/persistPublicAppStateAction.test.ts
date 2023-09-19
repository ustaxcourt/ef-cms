import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { persistPublicAppStateAction } from './persistPublicAppStateAction';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('persistPublicAppStateAction', () => {
  const advancedSearchFormValue = {
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
  };
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('should call the setItemInteractor to persists the tab and form', async () => {
    await runAction(persistPublicAppStateAction, {
      modules: {
        presenter,
      },
      state: {
        advancedSearchForm: advancedSearchFormValue,
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
      value: advancedSearchFormValue,
    });
  });
});
