import { Case } from '../../../../shared/src/business/entities/cases/Case';
import { applicationContext } from '../../applicationContext';
import { presenter } from '../presenter';
import { runAction } from 'cerebral/test';
import { updatePetitionFeePaymentAction } from './updatePetitionFeePaymentAction';

let updatePetitionFeePaymentInteractorStub;

presenter.providers.applicationContext = {
  ...applicationContext,
  getUseCases: () => ({
    updatePetitionFeePaymentInteractor: updatePetitionFeePaymentInteractorStub,
  }),
};

describe('updatePetitionFeePaymentAction', () => {
  beforeEach(() => {
    updatePetitionFeePaymentInteractorStub = jest
      .fn()
      .mockReturnValue({ docketNumber: '123-45' });
  });

  it('creates date from form month, day, year fields and calls the use case with form data for a waived payment', async () => {
    const result = await runAction(updatePetitionFeePaymentAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: { caseId: '123' },
        form: {
          paymentDateWaivedDay: '01',
          paymentDateWaivedMonth: '01',
          paymentDateWaivedYear: '2001',
          petitionPaymentStatus: Case.PAYMENT_STATUS.WAIVED,
        },
      },
    });

    expect(updatePetitionFeePaymentInteractorStub).toHaveBeenCalled();
    expect(
      updatePetitionFeePaymentInteractorStub.mock.calls[0][0],
    ).toMatchObject({
      petitionPaymentStatus: Case.PAYMENT_STATUS.WAIVED,
      petitionPaymentWaivedDate: '2001-01-01T05:00:00.000Z',
    });
    expect(result.output).toEqual({
      alertSuccess: {
        title: 'Your changes have been saved.',
      },
      caseDetail: { docketNumber: '123-45' },
      caseId: '123-45',
      tab: 'caseInfo',
    });
  });

  it('creates date from form month, day, year fields and calls the use case with form data for a paid payment', async () => {
    const result = await runAction(updatePetitionFeePaymentAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: { caseId: '123' },
        form: {
          paymentDateDay: '01',
          paymentDateMonth: '01',
          paymentDateYear: '2001',
          petitionPaymentStatus: Case.PAYMENT_STATUS.PAID,
        },
      },
    });

    expect(updatePetitionFeePaymentInteractorStub).toHaveBeenCalled();
    expect(
      updatePetitionFeePaymentInteractorStub.mock.calls[0][0],
    ).toMatchObject({
      petitionPaymentDate: '2001-01-01T05:00:00.000Z',
      petitionPaymentStatus: Case.PAYMENT_STATUS.PAID,
    });
    expect(result.output).toEqual({
      alertSuccess: {
        title: 'Your changes have been saved.',
      },
      caseDetail: { docketNumber: '123-45' },
      caseId: '123-45',
      tab: 'caseInfo',
    });
  });
});
