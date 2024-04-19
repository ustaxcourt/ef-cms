import { UploadPetitionStep5 } from '@shared/business/entities/startCase/UploadPetitionStep5';

export const validateUploadPetitionStep5Action = ({
  path,
  props,
}: ActionProps<{ step5Data: any }>) => {
  const { step5Data } = props;

  const errors = new UploadPetitionStep5(
    step5Data,
  ).getFormattedValidationErrors();

  return errors
    ? path.error({
        errors,
      })
    : path.success();
};
