import { PAYMENT_STATUS } from '@shared/business/entities/EntityConstants';
import { state } from '@web-client/presenter/app.cerebral';

export const checkCaseAssociationAndPaymentStatusAction = ({
  get,
  props,
  path,
}: ActionProps) => {
  const caseDetail = get(state.caseDetail);

  if (
    props.isDirectlyAssociated &&
    caseDetail.petitionPaymentStatus == PAYMENT_STATUS.UNPAID
  )
    return path.success();
  else return path.error();
};
