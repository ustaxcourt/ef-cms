import { chooseStatisticValidationStrategyAction } from './chooseStatisticValidationStrategyAction';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('chooseStatisticValidationStrategyAction', () => {
  const addEditStatisticMock = jest.fn();
  const caseDetailMock = jest.fn();
  const startCaseMock = jest.fn();

  beforeAll(() => {
    presenter.providers.path = {
      addEditStatistic: addEditStatisticMock,
      caseDetail: caseDetailMock,
      startCase: startCaseMock,
    };
  });

  it('should call path.addEditStatistic when statisticIndex is undefined', async () => {
    await runAction(chooseStatisticValidationStrategyAction, {
      modules: { presenter },
      state: {
        form: { isPaper: false },
        modal: { statisticIndex: undefined },
      },
    });

    expect(addEditStatisticMock).toHaveBeenCalled();
    expect(startCaseMock).not.toHaveBeenCalled();
    expect(caseDetailMock).not.toHaveBeenCalled();
  });

  it('should call path.startCase when statisticIndex is 0 and isPaper is true', async () => {
    await runAction(chooseStatisticValidationStrategyAction, {
      modules: { presenter },
      state: {
        form: { isPaper: true },
        modal: { statisticIndex: 0 },
      },
    });

    expect(startCaseMock).toHaveBeenCalled();
    expect(caseDetailMock).not.toHaveBeenCalled();
    expect(addEditStatisticMock).not.toHaveBeenCalled();
  });

  it('should call path.caseDetail when statisticIndex is 0 and isPaper is false', async () => {
    await runAction(chooseStatisticValidationStrategyAction, {
      modules: { presenter },
      state: {
        form: { isPaper: false },
        modal: { statisticIndex: 0 },
      },
    });

    expect(caseDetailMock).toHaveBeenCalled();
    expect(startCaseMock).not.toHaveBeenCalled();
    expect(addEditStatisticMock).not.toHaveBeenCalled();
  });
});
