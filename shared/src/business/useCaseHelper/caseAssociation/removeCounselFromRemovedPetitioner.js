const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { UnauthorizedError } = require('../../../errors/errors');

/**
 * removeCounselFromRemovedPetitioner
 *
 * @param {object} options the options object
 * @param {object} options.applicationContext the applicationContext
 * @param {object} options.caseEntity the case entity to modify and return
 * @param {string} options.petitionerContactId the contactId of the petitioner being removed from the case
 * @returns {Case} the updated case entity
 */
exports.removeCounselFromRemovedPetitioner = async ({
  applicationContext,
  caseEntity,
  petitionerContactId,
}) => {
  const authorizedUser = applicationContext.getCurrentUser();

  if (
    !isAuthorized(authorizedUser, ROLE_PERMISSIONS.QC_PETITION) &&
    !isAuthorized(authorizedUser, ROLE_PERMISSIONS.REMOVE_PETITIONER)
  ) {
    throw new UnauthorizedError('Unauthorized');
  }

  const practitioners =
    caseEntity.getPractitionersRepresenting(petitionerContactId);

  for (const practitioner of practitioners) {
    const practitionerIsAlsoAPetitionerOnCase = caseEntity.petitioners.some(
      petitioner => petitioner.petitionerContactId === practitioner.userId,
    );

    const doesPetitionerRepresentThemselves = practitioner.representing.some(
      petitionerId => petitionerId === petitionerContactId,
    );

    // const doesPractitionerRepresentOtherPetitioner =
    //   practitioner.representing.some(
    //     petitionerId => petitionerId !== petitionerContactId,
    //   );

    // fore practitioner
    // do they represent somebody else?
    // if they represent another petitioner on the case we don't remove them from the case
    // else removeRepresentingFromPractitioners
    // if that practitioner who represents someone else on the case is also a petitioner on the case
    // then only remove them from the representing array do not delete the representing array
    //

    if (practitioner.representing.length === 1) {
      caseEntity.removePrivatePractitioner(practitioner);

      if (practitionerIsAlsoAPetitionerOnCase) {
        if (doesPetitionerRepresentThemselves) {
          await applicationContext.getPersistenceGateway().deleteUserFromCase({
            applicationContext,
            docketNumber: caseEntity.docketNumber,
            userId: practitioner.userId,
          });
        }
      }
      // if (!practitionerIsAlsoAPetitionerOnCase) {
      //   await applicationContext.getPersistenceGateway().deleteUserFromCase({
      //     applicationContext,
      //     docketNumber: caseEntity.docketNumber,
      //     userId: practitioner.userId,
      //   });
      // }
    } else {
      caseEntity.removeRepresentingFromPractitioners(petitionerContactId);
    }
  }

  return caseEntity.validate();
};

// if (practitioner.representing.length === 1) {
//   caseEntity.removePrivatePractitioner(practitioner);

//   await applicationContext.getPersistenceGateway().deleteUserFromCase({
//     applicationContext,
//     docketNumber: caseEntity.docketNumber,
//     userId: practitioner.userId,
//   });
// } else {
//   caseEntity.removeRepresentingFromPractitioners(petitionerContactId);
// }
