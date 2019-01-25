import { runAction } from 'cerebral/test';

import presenter from '..';
import sinon from 'sinon';
import getTrialCities from './getTrialCitiesAction';

presenter.providers.applicationContext = {
  getUseCases: () => ({
    getTrialCities: async () => {
      return null;
    },
  }),
};

describe('getTrialCities', async () => {
  let errorSpy;

  beforeEach(() => {
    errorSpy = sinon.spy();
    presenter.providers.path = {
      success() {},
      error: errorSpy,
    };
  });

  it('should invoke the error path when no trial cities are returned', async () => {
    await runAction(getTrialCities, {
      state: {
        user: {
          userId: 'docketclerk',
        },
      },
      modules: {
        presenter,
      },
    });
    expect(errorSpy.called).toEqual(true);
  });
});
