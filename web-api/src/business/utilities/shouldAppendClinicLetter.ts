import { Case } from '@shared/business/entities/cases/Case';
import { RawTrialSession } from '@shared/business/entities/trialSessions/TrialSession';
import { getClinicLetterKey } from './getClinicLetterKey';
import { ServerApplicationContext } from '@web-api/applicationContext';

export const shouldAppendClinicLetter = async ({
  applicationContext,
  caseEntity,
  procedureType,
  trialSession,
}: {
  applicationContext: ServerApplicationContext;
  caseEntity: RawCase;
  procedureType: string;
  trialSession: RawTrialSession;
}): Promise<{ appendClinicLetter: boolean; clinicLetterKey: string }> => {
  let appendClinicLetter = false;
  let clinicLetterKey: string = '';

  // add clinic letter for ANY pro se petitioner
  for (const petitioner of caseEntity.petitioners) {
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
