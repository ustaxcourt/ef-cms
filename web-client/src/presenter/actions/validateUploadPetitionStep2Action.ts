import { UploadPetitionStep2 } from '@shared/business/entities/startCase/UploadPetitionStep2';

export const validateUploadPetitionStep2Action = ({
  path,
  props,
}: ActionProps<{ createPetitionStep2Data: any }>) => {
  const { createPetitionStep2Data } = props;

  const errors = new UploadPetitionStep2(
    createPetitionStep2Data,
  ).getFormattedValidationErrors();

  if (errors) {
    return path.error({
      errors,
    });
  }

  return path.success();
};
