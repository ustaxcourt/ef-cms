import { Case } from '../entities/cases/Case';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../authorization/authorizationClientService';
import { UnauthorizedError } from '../../errors/errors';
import { formatPublicCase } from '../useCaseHelper/consolidatedCases/formatPublicCase';
/**
 * getConsolidatedCasesByCaseInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.docketNumber docket number of the case to get associated cases for
 * @returns {Array<object>} the cases the user is associated with
 */
export const getConsolidatedCasesByCaseInteractor = async (
  applicationContext: IApplicationContext,
  { docketNumber }: { docketNumber: string },
) => {
  const user = applicationContext.getCurrentUser();

  const consolidatedCasesForUser = await applicationContext
    .getPersistenceGateway()
    .getCasesByLeadDocketNumber({
      applicationContext,
      leadDocketNumber: docketNumber,
    });

  // we need to know what cases we are a party to
  //    - array of case objects
  // for the cases we aren't associated with, we call getPublicCaseInteractor
  //    - import the public case validator helper function

  const associatedCases = [];
  const nonAssociatedCases = [];

  for (let index = 0; index < consolidatedCasesForUser.length; index++) {
    const conCase = consolidatedCasesForUser[index];
    console.log('conCase.docketNumber', conCase.docketNumber);

    const isAssociated = await applicationContext
      .getPersistenceGateway()
      .verifyCaseForUser({
        applicationContext,
        docketNumber: conCase.docketNumber,
        userId: user.userId,
      });
    if (isAssociated) {
      associatedCases.push(conCase);
    } else {
      nonAssociatedCases.push(conCase);
    }
  }

  const nonAssociatedCasesData = nonAssociatedCases.map(conCase =>
    formatPublicCase({
      applicationContext,
      docketNumber: conCase.docketNumber,
      rawCaseRecord: conCase,
    }),
  );
  const associatedCasesData = Case.validateRawCollection(associatedCases, {
    applicationContext,
  });

  console.log('associatedCasesData*****', associatedCasesData);

  return [...nonAssociatedCasesData, ...associatedCasesData];

  // console.log('nonAssociatedCases*****', nonAssociatedCases);
  // console.log('associatedCases*****', associatedCases);

  // console.log('consolidatedCasesForUser ********', consolidatedCasesForUser);

  // return consolidatedCasesForUser.map(async conCase => {
  //   const isAssociated = await applicationContext
  //     .getPersistenceGateway()
  //     .verifyCaseForUser({
  //       applicationContext,
  //       docketNumber: conCase.docketNumber,
  //       userId: user.userId,
  //     });
  //   if (isAssociated) {
  //     const conCaseDetail = new Case(conCase, {
  //       applicationContext,
  //     })
  //       .validate()
  //       .toRawObject();

  //     console.log('conCaseDetail ********', conCaseDetail);

  //     return conCaseDetail;
  //   } else {
  //     return formatPublicCase({
  //       applicationContext,
  //       docketNumber,
  //       rawCaseRecord: conCase,
  //     });
  //   }
  // });
};
