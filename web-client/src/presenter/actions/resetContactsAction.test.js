import { runAction } from 'cerebral/test';

import presenter from '..';
import sinon from 'sinon';
import { resetContactsAction } from './resetContactsAction';

const updateCaseStub = sinon.stub().returns({});

presenter.providers.applicationContext = {
  getUseCases: () => ({
    updateCase: updateCaseStub,
  }),
};

describe('resetContactsAction', async () => {
  it('should filter the year amounts that do not have values', async () => {
    const { state } = await runAction(resetContactsAction, {
      state: {
        caseDetail: {
          other: 'data',
          contactPrimary: {
            email: 'E.mail@example.com',
            foo: 'bar',
            baz: 'quux',
          },
          contactSecondary: {
            apples: 'oranges',
            red: 'blue',
          },
        },
      },
    });
    expect(state.caseDetail).toEqual({
      other: 'data',
      contactPrimary: {
        countryType: 'domestic',
        email: 'E.mail@example.com',
      },
      contactSecondary: {
        countryType: 'domestic',
      },
    });
  });
});
