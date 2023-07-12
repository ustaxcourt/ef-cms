import { MOCK_CASE } from '../../../../../shared/src/test/mockCase';
import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';
import { submitRespondentCaseAssociationRequestAction } from './submitRespondentCaseAssociationRequestAction';

describe('submitRespondentCaseAssociationRequestAction', () => {
  const { USER_ROLES } = applicationContext.getConstants();
  const mockDocketNumber = '105-20';
  const consolidatedCasesDocketNumbers = ['100-20', '101-20', mockDocketNumber];

  presenter.providers.applicationContext = applicationContext;

  beforeAll(() => {
    (applicationContext.getCurrentUser as jest.Mock).mockReturnValue({
      role: USER_ROLES.irsPractitioner,
    });
  });

  it('should not call submitCaseAssociationRequestInteractor when the logged in user is not an IRS practitioner', async () => {
    applicationContext.getCurrentUser.mockReturnValueOnce({
      role: USER_ROLES.docketClerk,
    });

    await runAction(submitRespondentCaseAssociationRequestAction, {
      modules: { presenter },
      state: {
        caseDetail: {
          docketNumber: mockDocketNumber,
        },
      },
    });

    expect(
      applicationContext.getUseCases().submitCaseAssociationRequestInteractor,
    ).not.toHaveBeenCalled();
  });

  it('should call submitCaseAssociationRequestInteractor when the logged in user is not an IRS practitioner', async () => {
    await runAction(submitRespondentCaseAssociationRequestAction, {
      modules: { presenter },
      state: {
        caseDetail: {
          consolidatedCases: [
            { docketNumber: '100-20' },
            { docketNumber: '101-20' },
            { docketNumber: mockDocketNumber },
          ],
          docketNumber: mockDocketNumber,
        },
      },
    });

    expect(
      applicationContext.getUseCases().submitCaseAssociationRequestInteractor
        .mock.calls[0][1],
    ).toMatchObject({
      consolidatedCasesDocketNumbers: undefined,
      docketNumber: mockDocketNumber,
    });
  });

  it('should return the updated case as props', async () => {
    applicationContext
      .getUseCases()
      .submitCaseAssociationRequestInteractor.mockResolvedValue(MOCK_CASE);

    applicationContext.getCurrentUser.mockReturnValue({
      role: USER_ROLES.irsPractitioner,
    });

    const { output } = await runAction(
      submitRespondentCaseAssociationRequestAction,
      {
        modules: { presenter },
        state: {
          caseDetail: {
            docketNumber: mockDocketNumber,
          },
        },
      },
    );

    expect(output).toEqual(expect.objectContaining(MOCK_CASE));
  });

  it('should call submitCaseAssociationRequestInteractor with a list of consolidated case docketNumbers when props.fileAcrossConsolidatedGroup is true', async () => {
    await runAction(submitRespondentCaseAssociationRequestAction, {
      modules: { presenter },
      props: { fileAcrossConsolidatedGroup: true },
      state: {
        caseDetail: {
          consolidatedCases: [
            { docketNumber: '100-20' },
            { docketNumber: '101-20' },
            { docketNumber: mockDocketNumber },
          ],
          docketNumber: mockDocketNumber,
        },
      },
    });

    expect(
      applicationContext.getUseCases().submitCaseAssociationRequestInteractor
        .mock.calls[0][1],
    ).toMatchObject({
      consolidatedCasesDocketNumbers,
      docketNumber: mockDocketNumber,
    });
  });
});
