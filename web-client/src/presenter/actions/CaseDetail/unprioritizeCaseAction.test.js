import { MOCK_CASE } from '../../../../../shared/src/test/mockCase';
import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';
import { unprioritizeCaseAction } from './unprioritizeCaseAction';

describe('unprioritizeCaseAction', () => {
  presenter.providers.applicationContext = applicationContext;

  const mockDocketNumber = '123-45';

  it('should call unprioritizeCaseInteractor with state.caseDetail.docketNumber and state.modal.reason', async () => {
    await runAction(unprioritizeCaseAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          docketNumber: mockDocketNumber,
        },
      },
    });

    expect(
      applicationContext.getUseCases().unprioritizeCaseInteractor.mock
        .calls[0][1],
    ).toMatchObject({
      docketNumber: mockDocketNumber,
    });
  });

  it('should return an alertSuccess and caseDetail as props', async () => {
    await applicationContext
      .getUseCases()
      .unprioritizeCaseInteractor.mockReturnValue(MOCK_CASE);

    const { output } = await runAction(unprioritizeCaseAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          docketNumber: mockDocketNumber,
        },
      },
    });

    expect(output.alertSuccess).toEqual({
      message:
        'High priority removed. Case is eligible for next available trial session.',
    });
    expect(output.caseDetail).toEqual(MOCK_CASE);
  });
});
