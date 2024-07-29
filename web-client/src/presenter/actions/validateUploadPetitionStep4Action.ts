import { UploadPetitionStep4 } from '@shared/business/entities/startCase/UploadPetitionStep4';

export const validateUploadPetitionStep4Action = ({
  path,
  props,
}: ActionProps<{ createPetitionStep4Data: any }>) => {
  const { createPetitionStep4Data } = props;

  const errors = new UploadPetitionStep4(
    createPetitionStep4Data,
  ).getFormattedValidationErrors();

  if (errors) {
    return path.error({
      errors,
    });
  }

  return path.success();
};
