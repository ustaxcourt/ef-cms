import { UploadPetitionStep2 } from '@shared/business/entities/startCase/UploadPetitionStep2';

export const validateFilePetitionPetitionerInformationAction = ({
  path,
  props,
}: ActionProps<{ petitionerInformation: any }>) => {
  const { petitionerInformation } = props;

  const errors = new UploadPetitionStep2(
    petitionerInformation,
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
