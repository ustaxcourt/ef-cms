/**
 * updateCase
 *
 * @param caseId
 * @param caseToUpdate
 * @param userId
 * @param applicationContext
 * @returns {*}
 */
exports.runBatchProcess = async ({ caseId, applicationContext }) => {
  console.log('got a caseid', caseId);
  //   const user = applicationContext.getCurrentUser();

  //   if (!isAuthorized(user, UPDATE_CASE)) {
  //     throw new UnauthorizedError('Unauthorized for update case');
  //   }

  //   if (!caseToUpdate || caseId !== caseToUpdate.caseId) {
  //     throw new UnprocessableEntityError();
  //   }

  //   if (caseToUpdate.documents) {
  //     caseToUpdate.documents = setDocumentDetails(
  //       user.userId,
  //       caseToUpdate.documents,
  //     );
  //   }

  //   const paidCase = new Case(caseToUpdate)
  //     .markAsPaidByPayGov(caseToUpdate.payGovDate)
  //     .updateCaptionDocketRecord()
  //     .validate()
  //     .toRawObject();

  //   const caseAfterUpdate = await applicationContext
  //     .getPersistenceGateway()
  //     .saveCase({
  //       applicationContext,
  //       caseToSave: paidCase,
  //     });

  //   return new Case(caseAfterUpdate).validate().toRawObject();
};
