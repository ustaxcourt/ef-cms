import { canUserUpdatePetitionerContact } from '@shared/business/utilities/canUserUpdatePetitionerContact';
import { state } from '@web-client/presenter/app.cerebral';

export const canUserUpdatePetitionerAction = ({
  props,
  path,
  get,
}: ActionProps) => {
  const user = get(state.user);
  const { caseDetail, contactId } = props;
  if (!caseDetail || !contactId || !user) return path.no();

  if (
    canUserUpdatePetitionerContact({
      petitionerCaseRaw: caseDetail,
      contactId,
      user,
    })
  )
    return path.yes();
  return path.no();
};
