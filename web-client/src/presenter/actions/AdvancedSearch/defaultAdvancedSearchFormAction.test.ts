import { ALL_SELECTION } from '@shared/business/entities/cases/CaseSearch';
import { applicationContextForClient } from '@web-client/test/createClientTestApplicationContext';
import { defaultAdvancedSearchFormAction } from './defaultAdvancedSearchFormAction';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('defaultAdvancedSearchFormAction', () => {
  presenter.providers.applicationContext = applicationContextForClient;

  it('sets defaults on state.advancedSearchForm if state.advancedSearchForm is empty', async () => {
    const result = await runAction(defaultAdvancedSearchFormAction, {
      modules: { presenter },
      state: {
        advancedSearchForm: {},
      },
    });

    expect(result.state.advancedSearchForm).toMatchObject({
      caseSearchByDocketNumber: {},
      caseSearchByName: {
        countryType: ALL_SELECTION,
      },
      opinionSearch: {
        opinionTypes: {
          MOP: true,
          OST: true,
          SOP: true,
          TCOP: true,
        },
      },
      orderSearch: {},
      practitionerSearchByBarNumber: {},
      practitionerSearchByName: {},
      searchMode: 'byName',
    });
  });

  it('sets defaults on state.opinionDocumentTypes if state.advancedSearchForm is empty', async () => {
    const result = await runAction(defaultAdvancedSearchFormAction, {
      modules: { presenter },
      state: {
        advancedSearchForm: {},
      },
    });

    expect(result.state.opinionDocumentTypes).toEqual([]);
  });

  it('should set the current page to 1', async () => {
    const result = await runAction(defaultAdvancedSearchFormAction, {
      modules: { presenter },
      state: {
        advancedSearchForm: {},
      },
    });

    expect(result.state.advancedSearchForm.currentPage).toEqual(1);
  });
});
