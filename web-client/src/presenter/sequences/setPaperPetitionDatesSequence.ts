import { computeStatisticDatesAction } from '../actions/StartCaseInternal/computeStatisticDatesAction';
import { getComputedFormDateFactoryAction } from '../actions/getComputedFormDateFactoryAction';
import { setComputeFormDateFactoryAction } from '../actions/setComputeFormDateFactoryAction';

export const setPaperPetitionDatesSequence = [
  // receivedAt
  // getComputedFormDateFactoryAction('receivedAt', true),
  // setComputeFormDateFactoryAction('receivedAt'),
  // irsNoticeDate
  getComputedFormDateFactoryAction('irs', true),
  setComputeFormDateFactoryAction('irsNoticeDate'),
  // petitionPaymentDate
  getComputedFormDateFactoryAction('paymentDate', true),
  setComputeFormDateFactoryAction('petitionPaymentDate'),
  // paymentDateWaived
  getComputedFormDateFactoryAction('paymentDateWaived', true),
  setComputeFormDateFactoryAction('petitionPaymentWaivedDate'),
  computeStatisticDatesAction,
];
