import { applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { setWorkItemAsReadAction } from './setWorkItemAsReadAction';

describe('setWorkItemAsReadAction', () => {
  let get;

  it('should set message as read', async () => {
    get = jest.fn();

    await setWorkItemAsReadAction({ applicationContext, get });

    expect(
      applicationContext.getUseCases().setWorkItemAsReadInteractor,
    ).toHaveBeenCalled();
    expect(get).toHaveBeenCalled();
  });
});
