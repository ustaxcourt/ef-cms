/**
 * validatePetitionForPetitionerAndSpouse
 * @param applicationContext
 * @param petitionForPetitionerAndSpouse
 * @returns {Object<any>| null}
 */
exports.validatePetitionForPetitionerAndSpouse = ({
  petitionForPetitionerAndSpouse,
  applicationContext,
}) => {
  const errors = new (applicationContext.getEntityConstructors()).PetitionForPetitionerAndSpouse(
    petitionForPetitionerAndSpouse,
  ).getFormattedValidationErrors();
  if (!errors) return null;
  return errors;
};
