# HeadSpace
- DO NOT REFACTOR
- If something seems questionable or gives a moment of pause mark with a comment: // TODO 10417

# TODO
- Go back to all // TODO 10417
- Look at validateRawCollection()

# Web-Client 
Steps to transition getCurrentUser() in web-client
1. Find applicationContext.getCurrentUser() and replace with get(state.user);
1. Update test to use state to set the user instead of mocking calls to getCurrentUser()

# Shared(DocketEntry, Case, PublicCase)
For Interactors that are still in shared follow the steps in the `Web-Api` section

For DocketEntry, Case, PublicCase

# Web-Api
Steps To transition an interactor away from getCurrentUser()
1. Make Interactor accept a 3rd paramater called authorizedUser: UnknownAuthUser
1. Remove applicationContext.getCurrentUser() and replace with the authorizedUser input.
1. Update test to pass in user instead of mocking getCurrentUser. Test users can be found in `shared/src/test/mockAuthUsers.ts`
1. Update everywhere the interactor is being called to pass in an authorizedUser. Most likely this will be in the lambda file of the same name, in which case you will make the lambda accept a second argument of the authorizedUser. Example below:


## Before
```typescript
import { genericHandler } from '../../genericHandler';

/**
 * lambda which is used for adding a petitioner to a case
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const addPetitionerToCaseLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    return await applicationContext
      .getUseCases()
      .addPetitionerToCaseInteractor(applicationContext, {
        ...event.pathParameters,
        ...JSON.parse(event.body),
      });
  });
```

## After
```typescript
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { addPetitionerToCaseInteractor } from '@shared/business/useCases/addPetitionerToCaseInteractor';
import { genericHandler } from '../../genericHandler';

/**
 * lambda which is used for adding a petitioner to a case
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const addPetitionerToCaseLambda = (
  event,
  authorizedUser: UnknownAuthUser,
) =>
  genericHandler(
    event,
    async ({ applicationContext }) => {
      return await addPetitionerToCaseInteractor(
        applicationContext,
        {
          ...event.pathParameters,
          ...JSON.parse(event.body),
        },
        authorizedUser,
      );
    },
    authorizedUser,
  );
```