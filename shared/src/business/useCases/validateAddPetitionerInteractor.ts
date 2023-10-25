import { Case } from '../entities/cases/Case';
import { TempTyping } from '@shared/business/entities/joiValidationEntity/JoiValidationEntity.getFormattedValidationErrors';
import { isEmpty, pick } from 'lodash';

export const validateAddPetitionerInteractor = (
  applicationContext: IApplicationContext,
  { caseDetail, contact }: { contact: any; caseDetail: RawCase },
): Partial<TempTyping> | undefined => {
  const newPetitionerIndex = caseDetail.petitioners.length;

  const caseErrors = new Case(
    {
      ...caseDetail,
      caseCaption: contact.caseCaption,
      petitioners: [...caseDetail.petitioners, contact],
    },
    {
      applicationContext,
    },
  ).getFormattedValidationErrors();

  let addPetitionerErrors = pick(caseErrors, [
    'petitioners',
    `petitioners[${newPetitionerIndex}]`,
    'caseCaption',
  ]);

  if (addPetitionerErrors.petitioners) {
    const petitionerContactErrors = addPetitionerErrors.petitioners.find(
      item => item.index === newPetitionerIndex,
    );

    delete addPetitionerErrors.petitioners;
    delete petitionerContactErrors.index;

    addPetitionerErrors = {
      ...addPetitionerErrors,
      ...petitionerContactErrors,
    };
  }

  return isEmpty(addPetitionerErrors) ? undefined : addPetitionerErrors;
};
