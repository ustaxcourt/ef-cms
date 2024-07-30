import { UploadPetitionStep1 } from '@shared/business/entities/startCase/UploadPetitionStep1';

export const validateUploadPetitionStep1Action = ({
  path,
  props,
}: ActionProps<{ step1Data: any }>) => {
  const { step1Data } = props;

  const errors = new UploadPetitionStep1(
    step1Data,
  ).getFormattedValidationErrors();

  if (!errors) {
    return path.success();
  }

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
};
