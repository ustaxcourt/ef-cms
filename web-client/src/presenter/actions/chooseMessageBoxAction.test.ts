import { chooseMessageBoxAction } from './chooseMessageBoxAction';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('chooseMessageBoxAction', () => {
  const myinboxMock = jest.fn();

  beforeAll(() => {
    presenter.providers.path = {
      myinbox: myinboxMock,
    };
  });

  it('sets state.messageBoxToDisplay from props and calls the path to the correct box', async () => {
    const { state } = await runAction(chooseMessageBoxAction, {
      modules: { presenter },
      props: {
        box: 'inbox',
        queue: 'my',
      },
    });

    expect(state.messageBoxToDisplay).toEqual({
      box: 'inbox',
      queue: 'my',
    });
    expect(myinboxMock).toHaveBeenCalled();
  });
});
