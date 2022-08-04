const { getClinicLetterKey } = require('./getClinicLetterKey');

const shouldAppendClinicLetter = async ({
  applicationContext,
  caseEntity,
  procedureType,
  trialSession,
}) => {
  let appendClinicLetter = false;
  let clinicLetterKey;

  // add clinic letter for ANY pro se petitioner
  for (let petitioner of caseEntity.petitioners) {
    if (
      !caseEntity.isUserIdRepresentedByPrivatePractitioner(petitioner.contactId)
    ) {
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

module.exports = {
  shouldAppendClinicLetter,
};
