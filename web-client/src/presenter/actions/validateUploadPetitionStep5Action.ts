import { UploadPetitionStep5 } from '@shared/business/entities/startCase/UploadPetitionStep5';

export const validateUploadPetitionStep5Action = ({
  path,
  props,
}: ActionProps<{ createPetitionStep5Data: any }>) => {
  const { createPetitionStep5Data } = props;

  const errors = new UploadPetitionStep5(
    createPetitionStep5Data,
  ).getFormattedValidationErrors();

  return errors
    ? path.error({
        errors,
      })
    : path.success();
};
