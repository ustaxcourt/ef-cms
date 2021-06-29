import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';
import { updatePetitionDetailsAction } from './updatePetitionDetailsAction';

describe('updatePetitionDetailsAction', () => {
  let PAYMENT_STATUS;

  beforeAll(() => {
    ({ PAYMENT_STATUS } = applicationContext.getConstants());
    presenter.providers.applicationContext = applicationContext;

    applicationContext
      .getUseCases()
      .updatePetitionDetailsInteractor.mockReturnValue({
        docketNumber: '123-20',
      });
  });

  it('calls the use case with form data for a waived payment', async () => {
    const result = await runAction(updatePetitionDetailsAction, {
      modules: {
        presenter,
      },
      props: { petitionPaymentWaivedDate: '2001-01-01T05:00:00.000Z' },
      state: {
        caseDetail: { docketNumber: '123-20' },
        form: {
          petitionPaymentStatus: PAYMENT_STATUS.WAIVED,
        },
      },
    });

    expect(
      applicationContext.getUseCases().updatePetitionDetailsInteractor,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getUseCases().updatePetitionDetailsInteractor.mock
        .calls[0][1],
    ).toMatchObject({
      petitionDetails: {
        petitionPaymentStatus: PAYMENT_STATUS.WAIVED,
        petitionPaymentWaivedDate: '2001-01-01T05:00:00.000Z',
      },
    });
    expect(result.output).toEqual({
      alertSuccess: {
        message: 'Changes saved.',
      },
      caseDetail: { docketNumber: '123-20' },
      docketNumber: '123-20',
      tab: 'caseInfo',
    });
  });

  it('calls the use case with form data for a paid payment', async () => {
    const result = await runAction(updatePetitionDetailsAction, {
      modules: {
        presenter,
      },
      props: {
        petitionPaymentDate: '2001-01-01T05:00:00.000Z',
      },
      state: {
        caseDetail: { docketNumber: '123-20' },
        form: {
          petitionPaymentStatus: PAYMENT_STATUS.PAID,
        },
      },
    });

    expect(
      applicationContext.getUseCases().updatePetitionDetailsInteractor,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getUseCases().updatePetitionDetailsInteractor.mock
        .calls[0][1],
    ).toMatchObject({
      petitionDetails: {
        petitionPaymentDate: '2001-01-01T05:00:00.000Z',
        petitionPaymentStatus: PAYMENT_STATUS.PAID,
      },
    });
    expect(result.output).toEqual({
      alertSuccess: {
        message: 'Changes saved.',
      },
      caseDetail: { docketNumber: '123-20' },
      docketNumber: '123-20',
      tab: 'caseInfo',
    });
  });

  it('calls the use case with form data', async () => {
    const result = await runAction(updatePetitionDetailsAction, {
      modules: {
        presenter,
      },
      props: { irsNoticeDate: '2001-01-01T05:00:00.000Z' },
      state: {
        caseDetail: { docketNumber: '123-20' },
        form: {
          irsDay: '01',
          irsMonth: '01',
          irsYear: '2001',
        },
      },
    });

    expect(
      applicationContext.getUseCases().updatePetitionDetailsInteractor,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getUseCases().updatePetitionDetailsInteractor.mock
        .calls[0][1],
    ).toMatchObject({
      petitionDetails: {
        irsNoticeDate: '2001-01-01T05:00:00.000Z',
      },
    });
    expect(result.output).toEqual({
      alertSuccess: {
        message: 'Changes saved.',
      },
      caseDetail: { docketNumber: '123-20' },
      docketNumber: '123-20',
      tab: 'caseInfo',
    });
  });

  it('should send preferredTrialCity to the use case as null if it is not on the form', async () => {
    await runAction(updatePetitionDetailsAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: { docketNumber: '123-20' },
        form: {},
      },
    });

    expect(
      applicationContext.getUseCases().updatePetitionDetailsInteractor,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getUseCases().updatePetitionDetailsInteractor.mock
        .calls[0][1],
    ).toMatchObject({
      petitionDetails: {
        preferredTrialCity: null,
      },
    });
  });

  it('should send preferredTrialCity to the use case if it is on the form', async () => {
    await runAction(updatePetitionDetailsAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: { docketNumber: '123-20' },
        form: { preferredTrialCity: 'Fresno, California' },
      },
    });

    expect(
      applicationContext.getUseCases().updatePetitionDetailsInteractor,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getUseCases().updatePetitionDetailsInteractor.mock
        .calls[0][1],
    ).toMatchObject({
      petitionDetails: {
        preferredTrialCity: 'Fresno, California',
      },
    });
  });
});
