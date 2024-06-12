import { UploadPetitionStep2 } from '@shared/business/entities/startCase/UploadPetitionStep2';

export const validateFilePetitionPetitionerInformationAction = ({
  path,
  props,
}: ActionProps<{ petitionerInformationAction: any }>) => {
  const { petitionerInformationAction } = props;

  const errors = new UploadPetitionStep2(
    petitionerInformationAction,
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
