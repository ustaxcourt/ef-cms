import { hasOrderTypeSelectedAction } from './hasOrderTypeSelectedAction';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('hasOrderTypeSelectedAction', () => {
  let noStub;
  let proceedStub;

  beforeAll(() => {
    noStub = jest.fn();
    proceedStub = jest.fn();

    presenter.providers.path = {
      no: noStub,
      proceed: proceedStub,
    };
  });

  it('proceeds if an eventCode has been selected', async () => {
    await runAction(hasOrderTypeSelectedAction, {
      modules: {
        presenter,
      },
      props: {
        docketNumber: '123-19',
        eventCode: 'ABC',
      },
    });

    expect(proceedStub).toHaveBeenCalled();
  });

  it('does not proceed if an eventCode has not been selected', async () => {
    await runAction(hasOrderTypeSelectedAction, {
      modules: {
        presenter,
      },
      props: {
        docketNumber: '123-19',
      },
      state: {
        modal: {},
      },
    });

    expect(noStub).toHaveBeenCalled();
  });
});
