import { AddPrivatePractitioner } from '../../entities/caseAssociation/AddPrivatePractitioner';

export const validateAddPrivatePractitionerInteractor = ({
  counsel,
}: {
  counsel: any;
}) => {
  const errors = new AddPrivatePractitioner(
    counsel,
  ).getFormattedValidationErrors();

  if (!errors) return null;
  return errors;
};
