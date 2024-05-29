import { UploadPetitionStep3 } from '@shared/business/entities/startCase/UploadPetitionStep3';

export const validateUploadPetitionStep3Action = ({
  path,
  props,
}: ActionProps<{ step3Data: any }>) => {
  const { step3Data } = props;

  const errors = new UploadPetitionStep3(
    step3Data,
  ).getFormattedValidationErrors();

  return errors
    ? path.error({
        errors,
      })
    : path.success();
};
