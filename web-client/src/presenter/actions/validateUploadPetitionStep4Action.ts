import { UploadPetitionStep4 } from '@shared/business/entities/startCase/UploadPetitionStep4';

export const validateUploadPetitionStep4Action = ({
  path,
  props,
}: ActionProps<{ step4Data: any }>) => {
  const { step4Data } = props;

  const errors = new UploadPetitionStep4(
    step4Data,
  ).getFormattedValidationErrors();

  console.log('errors', errors);

  return errors
    ? path.error({
        errors,
      })
    : path.success();
};
