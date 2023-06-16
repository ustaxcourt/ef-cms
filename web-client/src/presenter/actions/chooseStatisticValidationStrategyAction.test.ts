import { chooseStatisticValidationStrategyAction } from './chooseStatisticValidationStrategyAction';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('chooseStatisticValidationStrategyAction', () => {
  const addEditStatisticMock = jest.fn();
  const startCaseMock = jest.fn();

  beforeAll(() => {
    presenter.providers.path = {
      addEditStatistic: addEditStatisticMock,
      startCase: startCaseMock,
    };
  });

  it('should call path.addEditStatistic when statisticIndex is undefined', async () => {
    await runAction(chooseStatisticValidationStrategyAction, {
      modules: { presenter },
      state: {
        modal: { statisticIndex: undefined },
      },
    });

    expect(addEditStatisticMock).toHaveBeenCalled();
    expect(startCaseMock).not.toHaveBeenCalled();
  });

  it('should call path.startCase when statisticIndex is defined', async () => {
    await runAction(chooseStatisticValidationStrategyAction, {
      modules: { presenter },
      state: {
        modal: { statisticIndex: 1 },
      },
    });

    expect(addEditStatisticMock).not.toHaveBeenCalled();
    expect(startCaseMock).toHaveBeenCalled();
  });

  it('should call path.startCase when statisticIndex is 0', async () => {
    await runAction(chooseStatisticValidationStrategyAction, {
      modules: { presenter },
      state: {
        modal: { statisticIndex: 0 },
      },
    });

    expect(addEditStatisticMock).not.toHaveBeenCalled();
    expect(startCaseMock).toHaveBeenCalled();
  });
});
