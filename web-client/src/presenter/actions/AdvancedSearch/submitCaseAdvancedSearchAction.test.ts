import {
  COUNTRY_TYPES,
  US_STATES,
} from '@shared/business/entities/EntityConstants';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { submitCaseAdvancedSearchAction } from './submitCaseAdvancedSearchAction';

describe('submitCaseAdvancedSearchAction', () => {
  presenter.providers.applicationContext = applicationContext;
  let baseState;

  beforeEach(() => {
    baseState = {
      advancedSearchForm: {
        caseSearchByName: {
          countryType: 'all',
          petitionerName: 'Petitioner 1',
          petitionerState: 'AK',
          yearFiledMax: '12/12/2023',
          yearFiledMin: '01/01/1991',
        },
      },
    };
  });

  it('should call caseAdvancedSearchInteractor with no state or country as searchParams if searchParams.countryType is "all"', async () => {
    await runAction(submitCaseAdvancedSearchAction, {
      modules: {
        presenter,
      },
      state: baseState,
    });

    expect(
      applicationContext.getUseCases().caseAdvancedSearchInteractor.mock.calls
        .length,
    ).toEqual(1);
    expect(
      applicationContext.getUseCases().caseAdvancedSearchInteractor.mock
        .calls[0][1].searchParams,
    ).toEqual({
      countryType: undefined,
      petitionerName: 'Petitioner 1',
      petitionerState: undefined,
      yearFiledMax: '12/12/2023',
      yearFiledMin: '01/01/1991',
    });
  });

  it('should call caseAdvancedSearchInteractor with no state and "international" as countryType if searchParams.countryType is "international"', async () => {
    baseState.advancedSearchForm.caseSearchByName.countryType =
      COUNTRY_TYPES.INTERNATIONAL;
    await runAction(submitCaseAdvancedSearchAction, {
      modules: {
        presenter,
      },
      state: baseState,
    });

    expect(
      applicationContext.getUseCases().caseAdvancedSearchInteractor.mock.calls
        .length,
    ).toEqual(1);
    expect(
      applicationContext.getUseCases().caseAdvancedSearchInteractor.mock
        .calls[0][1].searchParams,
    ).toEqual({
      countryType: COUNTRY_TYPES.INTERNATIONAL,
      petitionerName: 'Petitioner 1',
      petitionerState: undefined,
      yearFiledMax: '12/12/2023',
      yearFiledMin: '01/01/1991',
    });
  });

  it('should call caseAdvancedSearchInteractor with a prescribed state and "domestic" as countryType if searchParams.countryType is domestic', async () => {
    baseState.advancedSearchForm.caseSearchByName.countryType =
      COUNTRY_TYPES.DOMESTIC;
    baseState.advancedSearchForm.caseSearchByName.petitionerState =
      US_STATES.AK;

    await runAction(submitCaseAdvancedSearchAction, {
      modules: {
        presenter,
      },
      state: baseState,
    });

    expect(
      applicationContext.getUseCases().caseAdvancedSearchInteractor.mock.calls
        .length,
    ).toEqual(1);
    expect(
      applicationContext.getUseCases().caseAdvancedSearchInteractor.mock
        .calls[0][1].searchParams,
    ).toEqual({
      countryType: COUNTRY_TYPES.DOMESTIC,
      petitionerName: 'Petitioner 1',
      petitionerState: US_STATES.AK,
      yearFiledMax: '12/12/2023',
      yearFiledMin: '01/01/1991',
    });
  });
});
