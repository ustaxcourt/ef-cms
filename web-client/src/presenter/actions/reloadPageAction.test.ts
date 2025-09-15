import { reloadPageAction } from './reloadPageAction';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('reloadPageAction', () => {
  let reload;
  beforeAll(() => {
    const implSymbol = Reflect.ownKeys(window.location).find(
      i => typeof i === 'symbol',
    )!;
    reload = jest
      .spyOn((window.location as any)[implSymbol], 'reload')
      .mockImplementation(() => {});
  });

  it('should call location reload api', async () => {
    await runAction(reloadPageAction);
    expect(reload).toHaveBeenCalled();
  });
});
