import { MOCK_CASE } from '../../../../../shared/src/test/mockCase';
import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { prioritizeCaseAction } from './prioritizeCaseAction';
import { runAction } from 'cerebral/test';

describe('prioritizeCaseAction', () => {
  presenter.providers.applicationContext = applicationContext;

  const mockDocketNumber = '123-45';
  const mockReason = 'Just gimme a reason';

  it('should call prioritizeCaseInteractor with state.caseDetail.docketNumber and state.modal.reason', async () => {
    await runAction(prioritizeCaseAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          docketNumber: mockDocketNumber,
        },
        modal: {
          reason: mockReason,
        },
      },
    });

    expect(
      applicationContext.getUseCases().prioritizeCaseInteractor.mock
        .calls[0][1],
    ).toMatchObject({
      docketNumber: mockDocketNumber,
      reason: mockReason,
    });
  });

  it('should return an alertSuccess and caseDetail as props', async () => {
    await applicationContext
      .getUseCases()
      .prioritizeCaseInteractor.mockReturnValue(MOCK_CASE);

    const { output } = await runAction(prioritizeCaseAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          docketNumber: mockDocketNumber,
        },
        modal: {
          reason: mockReason,
        },
      },
    });

    expect(output.alertSuccess).toEqual({
      message:
        'Case added to eligible list and will be set for trial when calendar is set.',
    });
    expect(output.caseDetail).toEqual(MOCK_CASE);
  });
});
