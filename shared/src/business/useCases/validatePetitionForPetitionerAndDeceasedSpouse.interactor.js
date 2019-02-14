/**
 * validatePetitionForPetitionerAndDeceasedSpouse
 * @param applicationContext
 * @param petitionForPetitionerAndDeceasedSpouse
 * @returns {Object<any>| null}
 */
exports.validatePetitionForPetitionerAndDeceasedSpouse = ({
  petitionForPetitionerAndDeceasedSpouse,
  applicationContext,
}) => {
  const errors = new (applicationContext.getEntityConstructors()).PetitionForPetitionerAndDeceasedSpouse(
    petitionForPetitionerAndDeceasedSpouse,
  ).getFormattedValidationErrors();
  if (!errors) return null;
  return errors;
};
