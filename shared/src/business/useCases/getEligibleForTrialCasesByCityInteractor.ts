// import { CaseFactory } from '@shared/business/entities/cases/CaseFactory';
// import { ServerApplicationContext } from '@web-api/applicationContext';
// import { UnauthorizedError } from '@web-api/errors/errors';
// import {
//   UnknownAuthUser,
//   isAuthUser,
// } from '@shared/business/entities/authUser/AuthUser';
// import { getEligibleForTrialCasesByCity } from '@web-api/persistence/postgres/cases/getEligibleTrialCasesForCity';

// export const getEligibleForTrialCasesByCityInteractor = async (
//   applicationContext: ServerApplicationContext,
//   { trialCity }: { trialCity: string },
//   authorizedUser: UnknownAuthUser,
// ) => {
//   if (!isAuthUser(authorizedUser)) {
//     throw new UnauthorizedError(
//       `Invalid User attempting to view eligible cases for : ${trialCity}`,
//     );
//   }

//   const eligibleCases = await getEligibleForTrialCasesByCity({
//     trialCity,
//   });

//   return CaseFactory.getCase({ rawCase: caseRecord, user: authorizedUser });
// };
