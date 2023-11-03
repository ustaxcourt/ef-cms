import { AddIrsPractitioner } from '../../entities/caseAssociation/AddIrsPractitioner';

export const validateAddIrsPractitionerInteractor = ({
  counsel,
}: {
  counsel: any;
}) => {
  return new AddIrsPractitioner(counsel).getFormattedValidationErrors();
};
