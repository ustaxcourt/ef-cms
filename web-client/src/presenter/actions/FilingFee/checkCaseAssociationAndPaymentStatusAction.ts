import { PAYMENT_STATUS } from '@shared/business/entities/EntityConstants';
import {
  PAYMENT_FILLING_FEE_ORIGIN,
  readPaymentFillingFeeOriginFromStorage,
} from '@web-client/presenter/actions/FilingFee/paymentFillingFeeOriginStorage';
import { state } from '@web-client/presenter/app.cerebral';

export const checkCaseAssociationAndPaymentStatusAction = ({
  get,
  props,
  path,
}: ActionProps) => {
  const caseDetail = get(state.caseDetail);

  if (
    props.isDirectlyAssociated &&
    caseDetail.petitionPaymentStatus === PAYMENT_STATUS.UNPAID
  )
    return readPaymentFillingFeeOriginFromStorage() ===
      PAYMENT_FILLING_FEE_ORIGIN.DASHBOARD
      ? path.dashboard()
      : path.success();
  else return path.error();
};
