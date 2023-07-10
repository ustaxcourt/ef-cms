import { Case } from '../entities/cases/Case';
import { getClinicLetterKey } from './getClinicLetterKey';

export const shouldAppendClinicLetter = async ({
  applicationContext,
  caseEntity,
  procedureType,
  trialSession,
}): Promise<{ appendClinicLetter: boolean; clinicLetterKey: string }> => {
  let appendClinicLetter = false;
  let clinicLetterKey: string;

  // add clinic letter for ANY pro se petitioner
  for (let petitioner of caseEntity.petitioners) {
    if (!Case.isPetitionerRepresented(caseEntity, petitioner.contactId)) {
      clinicLetterKey = getClinicLetterKey({
        procedureType,
        trialLocation: trialSession.trialLocation,
      });
      const doesClinicLetterExist = await applicationContext
        .getPersistenceGateway()
        .isFileExists({
          applicationContext,
          key: clinicLetterKey,
        });
      if (doesClinicLetterExist) {
        appendClinicLetter = true;
      }
    }
  }
  return { appendClinicLetter, clinicLetterKey };
};
