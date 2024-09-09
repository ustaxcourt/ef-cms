import { MOCK_CASE } from '../../../../../shared/src/test/mockCase';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { docketClerkUser, irsPractitionerUser } from '@shared/test/mockUsers';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { submitRespondentCaseAssociationRequestAction } from './submitRespondentCaseAssociationRequestAction';

describe('submitRespondentCaseAssociationRequestAction', () => {
  presenter.providers.applicationContext = applicationContext;

  it('should not call submitCaseAssociationRequestInteractor when the logged in user is not an IRS practitioner', async () => {
    await runAction(submitRespondentCaseAssociationRequestAction, {
      modules: { presenter },
      state: {
        caseDetail: {
          docketNumber: MOCK_CASE.docketNumber,
        },
        user: docketClerkUser,
      },
    });

    expect(
      applicationContext.getUseCases().submitCaseAssociationRequestInteractor,
    ).not.toHaveBeenCalled();
  });

  it('should call submitCaseAssociationRequestInteractor when the logged in user is an IRS practitioner', async () => {
    await runAction(submitRespondentCaseAssociationRequestAction, {
      modules: { presenter },
      state: {
        caseDetail: {
          docketNumber: MOCK_CASE.docketNumber,
        },
        user: irsPractitionerUser,
      },
    });

    expect(
      applicationContext.getUseCases().submitCaseAssociationRequestInteractor
        .mock.calls[0][1],
    ).toMatchObject({
      docketNumber: MOCK_CASE.docketNumber,
    });
  });

  it('should return the updated case as props', async () => {
    applicationContext
      .getUseCases()
      .submitCaseAssociationRequestInteractor.mockResolvedValue(MOCK_CASE);

    const { output } = await runAction(
      submitRespondentCaseAssociationRequestAction,
      {
        modules: { presenter },
        state: {
          caseDetail: {
            docketNumber: MOCK_CASE.docketNumber,
          },
          user: irsPractitionerUser,
        },
      },
    );

    expect(output).toEqual(expect.objectContaining(MOCK_CASE));
  });
});
