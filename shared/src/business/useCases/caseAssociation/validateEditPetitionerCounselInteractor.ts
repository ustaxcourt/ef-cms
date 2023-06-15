import { EditPetitionerCounsel } from '../../entities/caseAssociation/EditPetitionerCounsel';

export const validateEditPetitionerCounselInteractor = ({
  practitioner,
}: {
  practitioner: any;
}) => {
  return new EditPetitionerCounsel(practitioner).getFormattedValidationErrors();
};
