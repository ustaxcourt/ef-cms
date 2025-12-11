import { isEmpty } from 'lodash';
import { state } from '@web-client/presenter/app.cerebral';

export const validatePetitionerInModalAction = ({
  applicationContext,
  get,
  path,
}: ActionProps) => {
  const { contact } = get(state.modal.form);
  const caseDetail = get(state.caseDetail);
  const errors = applicationContext.getUseCases().validatePetitionerInteractor({
    contactInfo: contact,
    existingPetitioners: caseDetail.petitioners,
  });

  if (isEmpty(errors)) {
    return path.success();
  } else {
    return path.error({ errors: { contact: errors } });
  }
};
