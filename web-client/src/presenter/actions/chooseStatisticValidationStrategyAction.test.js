import { chooseStatisticValidationStrategyAction } from './chooseStatisticValidationStrategyAction';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';

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
});
