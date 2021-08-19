import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { getCaseAction } from './getCaseAction';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';

describe('getCaseAction', () => {
  const mockDocketNumber = '999-99';
  const mockCase = { docketNumber: mockDocketNumber };

  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;

    applicationContext
      .getUseCases()
      .getCaseInteractor.mockReturnValue(mockCase);
  });

  it('should call getCaseInteractor with props.docketNumber', async () => {
    await runAction(getCaseAction, {
      modules: {
        presenter,
      },
      props: { docketNumber: mockDocketNumber },
    });

    expect(
      applicationContext.getUseCases().getCaseInteractor.mock.calls[0][1]
        .docketNumber,
    ).toEqual(mockDocketNumber);
  });

  it('should call getCaseInteractor with state.caseDetail.docketNumber when props.docketNumber is undefined', async () => {
    await runAction(getCaseAction, {
      modules: {
        presenter,
      },
      props: {},
      state: { caseDetail: { docketNumber: mockDocketNumber } },
    });

    expect(
      applicationContext.getUseCases().getCaseInteractor.mock.calls[0][1]
        .docketNumber,
    ).toEqual(mockDocketNumber);
  });

  it('should return the retrieved caseDetail as props', async () => {
    const { output } = await runAction(getCaseAction, {
      modules: {
        presenter,
      },
      props: {},
      state: { caseDetail: { docketNumber: mockDocketNumber } },
    });

    expect(output).toEqual({ caseDetail: mockCase });
  });
});
