import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { genericHandler } from '../../genericHandler';
import { getCaseInteractor } from '@shared/business/useCases/getCaseInteractor';
import { marshallCase } from './marshallers/marshallCase';
import { v2ApiWrapper } from './v2ApiWrapper';

export const getCaseLambda = (event, authorizedUser: UnknownAuthUser) =>
  genericHandler(event, ({ applicationContext }) =>
    v2ApiWrapper(async () => {
      const caseObject = await getCaseInteractor(
        applicationContext,
        {
          docketNumber: event.pathParameters.docketNumber,
        },
        authorizedUser,
      );
      caseObject.docketEntries =
        caseObject.docketEntries?.filter(
          (de: RawDocketEntry) => !!de.servedAt,
        ) ?? [];

      return marshallCase(caseObject);
    }),
  );
