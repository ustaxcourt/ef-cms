import { canUserUpdatePetitionerContact } from '@shared/business/utilities/canUserUpdatePetitionerContact';
import { state } from '@web-client/presenter/app.cerebral';

export const canUserUpdatePetitionerAction = ({
  props,
  path,
  get,
}: ActionProps) => {
  const user = get(state.user);
  const { caseDetail, contactId } = props;

  if (
    canUserUpdatePetitionerContact({
      petitionerCaseRaw: caseDetail,
      updatedPetitionerData: { contactId },
      user,
    })
  )
    return path.yes();
  return path.no();
};
