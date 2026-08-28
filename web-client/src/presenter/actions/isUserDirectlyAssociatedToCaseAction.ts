import { PRACTICE_TYPE } from '@shared/business/entities/EntityConstants';
import { RawPractitioner } from '@shared/business/entities/Practitioner';
import { state } from '@web-client/presenter/app.cerebral';

export const isUserDirectlyAssociatedToCaseAction = ({
  props,
  path,
  get,
  applicationContext,
}: ActionProps) => {
  const user = get(state.user);
  const { caseDetail } = props;

  const { USER_ROLES } = applicationContext.getConstants();

  let isFirstIrsFiling = false;

  if (user.role === USER_ROLES.irsPractitioner) {
    const isCaseSealed = applicationContext
      .getUtilities()
      .isSealedCase(caseDetail);
    const isDojPractitioner =
      (user as RawPractitioner).practiceType === PRACTICE_TYPE.DOJ;
    const caseHasRespondent = !!caseDetail.irsPractitioners?.length;

    isFirstIrsFiling =
      !caseHasRespondent && !isCaseSealed && !isDojPractitioner;
  }

  if (props.isDirectlyAssociated || isFirstIrsFiling) return path.yes();
  return path.no();
};
