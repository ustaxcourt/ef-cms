const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../authorization/authorizationClientService');
const {
  removeCounselFromRemovedPetitioner,
} = require('../useCaseHelper/caseAssociation/removeCounselFromRemovedPetitioner');
const { Case } = require('../entities/cases/Case');
const { CASE_STATUS_TYPES } = require('../entities/EntityConstants');
const { UnauthorizedError } = require('../../errors/errors');

/**
 * used to remove a petitioner from a case
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {object} providers.caseCaption the updated caseCaption
 * @param {object} providers.contactId the contactId of the person to remove from the case
 * @param {string} providers.docketNumber the docket number of the case
 * @returns {object} the case data
 */

exports.removePetitionerAndUpdateCaptionInteractor = async (
  applicationContext,
  { caseCaption, contactId, docketNumber },
) => {
  const petitionerContactId = contactId;
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, ROLE_PERMISSIONS.REMOVE_PETITIONER)) {
    throw new UnauthorizedError(
      'Unauthorized for removing petitioner from case',
    );
  }

  const caseToUpdate = await applicationContext
    .getPersistenceGateway()
    .getCaseByDocketNumber({ applicationContext, docketNumber });

  let caseEntity = new Case(caseToUpdate, { applicationContext });

  if (caseToUpdate.status === CASE_STATUS_TYPES.new) {
    throw new Error(
      `Case with docketNumber ${caseToUpdate.docketNumber} has not been served`,
    );
  }

  if (caseEntity.petitioners.length <= 1) {
    throw new Error(
      `Cannot remove petitioner ${petitionerContactId} from case with docketNumber ${caseToUpdate.docketNumber}`,
    );
  }

  caseEntity.removePetitioner(petitionerContactId);

  const deletedPetitionerIsAlsoPractitionerOnCase =
    caseEntity.privatePractitioners.some(
      privatePractitioner => privatePractitioner.userId === petitionerContactId,
    );

  if (!deletedPetitionerIsAlsoPractitionerOnCase) {
    //no
    await applicationContext.getPersistenceGateway().deleteUserFromCase({
      applicationContext,
      docketNumber,
      userId: petitionerContactId,
    });

    const isPetitionerRepresented = caseEntity.privatePractitioners.some(
      practitioner => practitioner.representing.includes(petitionerContactId),
    );

    if (!isPetitionerRepresented) {
      // do nothing
    } else {
      caseEntity = await removeCounselFromRemovedPetitioner({
        applicationContext,
        caseEntity,
        petitionerContactId,
      });

      // const practitioners =
      //   caseEntity.getPractitionersRepresenting(petitionerContactId);
      // console.log('Practitioners ', practitioners);

      // const practitionerModificationPromises = practitioners.map(
      //   async practitioner => {
      //     caseEntity.removeRepresentingFromPractitioners(petitionerContactId);

      //     if (practitioner.representing.length === 0) {
      //       caseEntity.removePrivatePractitioner(practitioner);

      //       if (
      //         caseEntity.petitioners.some(petitioner => {
      //           petitioner.contactId !== practitioner.userId;
      //         })
      //       ) {
      //         await applicationContext
      //           .getPersistenceGateway()
      //           .deleteUserFromCase({
      //             applicationContext,
      //             docketNumber: caseEntity.docketNumber,
      //             userId: practitioner.userId,
      //           });
      //       }
      //     }
      //   },
      // );

      // await Promise.all(practitionerModificationPromises);
    }
  } else {
    //yes
    // const practitionerInQuestion = caseEntity.privatePractitioners.find(
    //   privatePractitioner => privatePractitioner.userId === petitionerContactId,
    // );
    // const doesPetitionerRepresentThemselves =
    //   practitionerInQuestion.representing.some(
    //     petitionerId => petitionerId === petitionerContactId,
    //   );

    // if (!doesPetitionerRepresentThemselves) {
    //   //no
    //   //do nothing actually
    // } else {
    //   //yes
    //   const doesPetitionerRepresentOtherPetitioner =
    //     practitionerInQuestion.representing.some(
    //       petitionerId => petitionerId !== petitionerContactId,
    //     );

    //   if (!doesPetitionerRepresentOtherPetitioner) {
    //     caseEntity.removePrivatePractitioner(practitionerInQuestion);
    //     await applicationContext.getPersistenceGateway().deleteUserFromCase({
    //       applicationContext,
    //       docketNumber,
    //       userId: petitionerContactId,
    //     });
    //   } else {
    //     caseEntity.removeRepresentingFromPractitioners(petitionerContactId);
    //   }
    // }

    caseEntity = await removeCounselFromRemovedPetitioner({
      applicationContext,
      caseEntity,
      petitionerContactId,
    });
  }

  //Old stuff below

  caseEntity.caseCaption = caseCaption;

  const updatedCase = await applicationContext
    .getUseCaseHelpers()
    .updateCaseAndAssociations({
      applicationContext,
      caseToUpdate: caseEntity,
    });

  return new Case(updatedCase, { applicationContext }).validate().toRawObject();
};
