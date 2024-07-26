import { UploadPetitionStep1 } from '@shared/business/entities/startCase/UploadPetitionStep1';

export const validateUploadPetitionStep1Action = ({
  path,
  props,
}: ActionProps<{ createPetitionStep1Data: any }>) => {
  const { createPetitionStep1Data } = props;

  const errors = new UploadPetitionStep1(
    createPetitionStep1Data,
  ).getFormattedValidationErrors();

  if (errors) {
    const errorDisplayOrder = [
      'name',
      'secondaryName',
      'inCareOf',
      'title',
      'address1',
      'city',
      'state',
      'postalCode',
      'placeOfLegalResidence',
      'phone',
      'paperPetitionEmail',
    ];

    return path.error({
      errorDisplayOrder,
      errors,
    });
  }

  return path.success();
};
