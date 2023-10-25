import { state } from '@web-client/presenter/app.cerebral';

export const setupEditPetitionDetailFormAction = ({
  get,
  store,
}: ActionProps) => {
  const caseDetail = get(state.caseDetail);

  store.set(state.form, {
    caseType: caseDetail.caseType,
    hasVerifiedIrsNotice: caseDetail.hasVerifiedIrsNotice,
    irsNoticeDate: caseDetail.irsNoticeDate,
    petitionPaymentDate: caseDetail.petitionPaymentDate,
    petitionPaymentMethod: caseDetail.petitionPaymentMethod,
    petitionPaymentStatus: caseDetail.petitionPaymentStatus,
    petitionPaymentWaivedDate: caseDetail.petitionPaymentWaivedDate,
    preferredTrialCity: caseDetail.preferredTrialCity,
    procedureType: caseDetail.procedureType,
    statistics: caseDetail.statistics,
  });
};
