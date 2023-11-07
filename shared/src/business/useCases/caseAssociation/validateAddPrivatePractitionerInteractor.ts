import { AddPrivatePractitioner } from '../../entities/caseAssociation/AddPrivatePractitioner';

export const validateAddPrivatePractitionerInteractor = ({
  counsel,
}: {
  counsel: any;
}) => {
  return new AddPrivatePractitioner(counsel).getFormattedValidationErrors();
};
