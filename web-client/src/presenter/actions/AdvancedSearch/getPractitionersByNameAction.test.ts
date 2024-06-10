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
});
