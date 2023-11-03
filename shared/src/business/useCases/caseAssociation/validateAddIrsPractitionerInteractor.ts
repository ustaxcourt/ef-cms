import { AddIrsPractitioner } from '../../entities/caseAssociation/AddIrsPractitioner';

export const validateAddIrsPractitionerInteractor = ({
  counsel,
}: {
  counsel: any;
}) => {
  const errors = new AddIrsPractitioner(counsel).getValidationErrors();

  return errors;
};
