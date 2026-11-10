import { ALL_SELECTION } from '@shared/business/entities/EntityConstants';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { getPractitionersByNameAction } from './getPractitionersByNameAction';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('getPractitionersByNameAction', () => {
  presenter.providers.applicationContext = applicationContext;

  it('should call getPractitionersByNameInteractor with the practitionerName as name and return the results received', async () => {
    applicationContext
      .getUseCases()
      .getPractitionersByNameInteractor.mockReturnValue({
        searchResults: [{ barNumber: '11111' }],
      });

    const results = await runAction(getPractitionersByNameAction, {
      modules: {
        presenter,
      },
      state: {
        advancedSearchForm: {
          practitionerSearchByName: {
            lastKeysOfPages: ['1234'],
            practitionerName: 'Ricky',
          },
        },
      },
    });

    expect(
      applicationContext.getUseCases().getPractitionersByNameInteractor.mock
        .calls.length,
    ).toEqual(1);

    expect(
      applicationContext.getUseCases().getPractitionersByNameInteractor.mock
        .calls[0][1],
    ).toMatchObject({
      name: 'Ricky',
    });

    expect(results.output).toEqual({ searchResults: [{ barNumber: '11111' }] });
  });

  it('should call getPractitionersByNameInteractor with the search filters and return the results received', async () => {
    applicationContext
      .getUseCases()
      .getPractitionersByNameInteractor.mockReturnValue({
        searchResults: [{ barNumber: '11111' }],
      });

    const results = await runAction(getPractitionersByNameAction, {
      modules: {
        presenter,
      },
      state: {
        advancedSearchForm: {
          practitionerSearchByName: {
            lastKeysOfPages: ['1234'],
            practitionerName: 'Ricky',
            practiceType: 'IRS',
            practitionerType: 'Attorney',
            admissionStatus: 'Active',
            originalBarState: 'CA',
          },
        },
      },
    });

    expect(
      applicationContext.getUseCases().getPractitionersByNameInteractor.mock
        .calls.length,
    ).toEqual(1);

    expect(
      applicationContext.getUseCases().getPractitionersByNameInteractor.mock
        .calls[0][1],
    ).toMatchObject({
      name: 'Ricky',
      practiceType: 'IRS',
      practitionerType: 'Attorney',
      admissionStatus: 'Active',
      originalBarState: 'CA',
    });

    expect(results.output).toEqual({ searchResults: [{ barNumber: '11111' }] });
  });

  it('passes a null cursor value through to the next practitioner search', async () => {
    applicationContext
      .getUseCases()
      .getPractitionersByNameInteractor.mockReturnValue({
        searchResults: {
          lastKey: [],
          practitioners: [],
          total: 0,
        },
      });

    await runAction(getPractitionersByNameAction, {
      modules: {
        presenter,
      },
      props: { selectedPage: 0 },
      state: {
        advancedSearchForm: {
          practitionerSearchByName: {
            lastKeysOfPages: [null],
            practitionerName: 'Ricky',
          },
        },
      },
    });

    expect(
      applicationContext.getUseCases().getPractitionersByNameInteractor.mock
        .calls[0][1].searchAfter,
    ).toEqual([null]);
  });

  it('omits the default practitioner type from the search request', async () => {
    applicationContext
      .getUseCases()
      .getPractitionersByNameInteractor.mockReturnValue({
        searchResults: {
          lastKey: [],
          practitioners: [],
          total: 0,
        },
      });

    await runAction(getPractitionersByNameAction, {
      modules: {
        presenter,
      },
      props: { selectedPage: 0 },
      state: {
        advancedSearchForm: {
          practitionerSearchByName: {
            lastKeysOfPages: [],
            practitionerName: 'Ricky',
            practitionerType: ALL_SELECTION,
          },
        },
      },
    });

    expect(
      applicationContext.getUseCases().getPractitionersByNameInteractor.mock
        .calls[0][1].practitionerType,
    ).toBeUndefined();
  });
});
