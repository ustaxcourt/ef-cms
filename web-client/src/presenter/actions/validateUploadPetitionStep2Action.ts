import { UploadPetitionStep2 } from '@shared/business/entities/startCase/UploadPetitionStep2';

export const validateUploadPetitionStep2Action = ({
  path,
  props,
}: ActionProps<{ step2Data: any }>) => {
  const { step2Data } = props;

  const errors = new UploadPetitionStep2(
    step2Data,
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
    'email',
  ];

  return path.error({
    errorDisplayOrder,
    errors,
  });
};
