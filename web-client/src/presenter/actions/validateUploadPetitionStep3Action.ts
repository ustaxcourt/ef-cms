import { UploadPetitionStep3 } from '@shared/business/entities/startCase/UploadPetitionStep3';

export const validateUploadPetitionStep3Action = ({
  path,
  props,
}: ActionProps<{ createPetitionStep3Data: any }>) => {
  const { createPetitionStep3Data } = props;

  const errors = new UploadPetitionStep3(
    createPetitionStep3Data,
  ).getFormattedValidationErrors();

  if (errors) {
    return path.error({
      errors,
    });
  }

  return path.success();
};
