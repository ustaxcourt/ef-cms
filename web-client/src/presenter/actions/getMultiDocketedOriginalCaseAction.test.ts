import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { getMultiDocketedOriginalCaseAction } from './getMultiDocketedOriginalCaseAction';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('getMultiDocketedOriginalCaseAction', () => {
  const mockDocketNumber = '999-99';
  const mockCase = { docketNumber: mockDocketNumber };

  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;

    applicationContext
      .getUseCases()
      .getCaseInteractor.mockReturnValue(mockCase);
  });

  it('should call getCaseInteractor with props.docketNumber', async () => {
    await runAction(getMultiDocketedOriginalCaseAction, {
      modules: {
        presenter,
      },
      props: { originallyFiledDocketNumber: mockDocketNumber },
    });

    expect(
      applicationContext.getUseCases().getCaseInteractor.mock.calls[0][1]
        .docketNumber,
    ).toEqual(mockDocketNumber);
  });

  it('should not call getCaseInteractor when props.docketNumber is undefined', async () => {
    await runAction(getMultiDocketedOriginalCaseAction, {
      modules: {
        presenter,
      },
      props: {},
      state: { caseDetail: { docketNumber: mockDocketNumber } },
    });

    expect(
      applicationContext.getUseCases().getCaseInteractor,
    ).not.toHaveBeenCalled();
  });

  it('should return the retrieved caseDetail as props', async () => {
    const { output } = await runAction(getMultiDocketedOriginalCaseAction, {
      modules: {
        presenter,
      },
      props: {
        originallyFiledDocketNumber: mockDocketNumber,
      },
      state: { caseDetail: { docketNumber: mockDocketNumber } },
    });

    expect(output).toEqual({ multiDocketedOriginalCaseDetail: mockCase });
  });
});
