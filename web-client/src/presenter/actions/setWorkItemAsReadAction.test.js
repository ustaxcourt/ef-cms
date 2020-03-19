import { setWorkItemAsReadAction } from './setWorkItemAsReadAction';

describe('setWorkItemAsReadAction', () => {
  let get;
  let applicationContext;

  it('should set message as read', async () => {
    let setWorkItemAsReadStub = jest.fn();
    get = jest.fn();
    applicationContext = {
      getUseCases: () => ({
        setWorkItemAsReadInteractor: setWorkItemAsReadStub,
      }),
    };

    await setWorkItemAsReadAction({ applicationContext, get });

    expect(setWorkItemAsReadStub.mock.calls.length).toEqual(1);
    expect(get.mock.calls.length).toEqual(1);
  });
});
