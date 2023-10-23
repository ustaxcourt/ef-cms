# Entity Locking

In order to help avert race conditions, where two users (or even the same user) perform tasks that could result in unpredictable and undesirable results, we have a use case helper that places locks on entities. Every request made that performs writes to an entity should acquire a lock and release the lock when it is finished. If a lock is found while attempting to acquire one, processing stops and a **ServiceUnavailableError** is thrown. This error can be caught or handled in such a way to retry the request.

## Entity Lock

The basic properties of a lock are the `identifier` and the `ttl` (time to live).

The **identifier** is simply a string representing the entity that you are trying to lock. For example, a case with docket number `123-20` would be have an identifier of `case|123-20`.

The **ttl** is a number that represents the maximum amount of time the lock should be in place. The default value is 30 seconds, as that's how long our synchronous lambdas have to execute. However, you can specify any number, and 900 is a good choice for the asynchronous lambdas that can run for up to 15 minutes.

## Acquiring a Lock

In any of the following, identifier can be a string or an array of strings to lock.

### Within an Interactor

You can directly attempt to acquire a lock within the body of an interactor. Towards the top of your interactor, attempt to acquire the lock:

```typescript
await applicationContext.getUseCaseHelpers().acquireLock({
  applicationContext,
  identifier: 'case|123-20', 
});

// or for multiple entities: 
await applicationContext.getUseCaseHelpers().acquireLock({
  applicationContext,
  identifier: ['case|111-20', 'case|222-20'],
});
```

This will attempt to lock your entity (or entities) for the default 30 seconds.

If it fails to acquire a lock, it will throw a `ServiceUnavailableError`. If you don't catch that error, the Lambda will return the error with a 504 status code to API Gateway, which the client may handle in order to retry the original request.

If it was able to acquire a lock, the interactor will continue to process the request.

NOTE: it's best to also remove the lock rather than letting it expire after it's `ttl`.
To remove the lock when you are finished with it (e.g., after calling `updateCaseAndAssociations()`), here's how:

```typescript
await applicationContext.getPersistenceGateway().removeLock({
  applicationContext,
  identifier: 'case|123-20', 
});

// or for multiple entities:
await applicationContext.getPersistenceGateway().removeLock({
  applicationContext,
  identifier: ['case|111-20', 'case|222-20'],
});
```

### Wrapping an Interactor

If you are working within a very large interactor that has many lines, it may be more desirable to wrap it rather than adding even more lines to that function. A `withLocking` wrapper is available for this purpose. Get started by importing it:

```typescript
import { withLocking } from '@shared/business/useCaseHelper/acquireLock';
```

Then rename your original interactor function; you will reference it later:

```typescript
// this had been updateSomethingInteractor
export const updateSomething = async (applicationContext, { docketNumber }) => {
  // ... process the request
};
```

The wrapper will need to know which entities to lock, and so you can create a small function that returns an object with same attributes that you would pass to `acquireLock`. The only required attribute is `identifier`. This function always gets called with `applicationContext` and the original request, and it can be an async function.

```typescript
// a function that determines the entity or entities to lock
const getLockInfo = (_applicationContext, { docketNumber }) => ({
  identifier: `case|${docketNumber}`
});

// async example that determines the entity or entities to lock
const getLockInfo = async (applicationContext, { workItemId }) => {
  const rawWorkItem = await applicationContext
    .getPersistenceGateway()
    .getWorkItemById({ 
      applicationContext, 
      workItemId,
    });

  return {
    identifier: `case|${rawWorkItem.docketNumber}`
  };
};

```

Now it's time to export the wrapped interactor with the function that returns the lock information.

```typescript
// your newly wrapped interactor
export const updateSomethingInteractor = withLocking(
  updateSomething,
  getLockInfo
);
```

Here are all of the lines put together:

```typescript
import { withLocking } from '@shared/business/useCaseHelper/acquireLock';

// the original interactor, renamed
export const updateSomething = async (applicationContext, { docketNumber }) => {
  // ... process the request
};

// a function that determines the entity or entities to lock
const getLockInfo = (_applicationContext, { docketNumber }) => ({
  identifier: `case|${docketNumber}`
});

// your newly wrapped interactor
export const updateSomethingInteractor = withLocking(
  updateSomething,
  getLockInfo
);
```

### Advanced Handling on Failure

You may wish for a function to be called if you fail to acquire a lock. One use case for this is if an asynchronous lambda fails to acquire a lock, you will need to send a websocket message to the user in order to retry the request or process the failure.

```typescript
// define a function to call when acquiring a lock fails
const handleLockError = async (
  applicationContext: IApplicationContext,
  originalRequest: any,
) => {
  const user = applicationContext.getCurrentUser();

  await applicationContext.getNotificationGateway().sendNotificationToUser({
    applicationContext,
    message: {
      action: 'retry_async_request',
      originalRequest,
      requestToRetry: 'update_something',
    },
    userId: user.userId,
  });
};
```

Then, pass that function into the attempt to acquire a lock:

```typescript
await applicationContext.getUseCaseHelpers().acquireLock({
  applicationContext,
  identifier: 'case|123-20',
  onLockError: handleLockError,
});
```

Or provide it as the third parameter in the `withLocking` wrapper:

```typescript
export const updateSomethingInteractor = withLocking(
  updateSomething,
  determineEntitiesToLock,
  handleLockError,
);
```

Or catch the error while trying to acquire the lock:

```typescript
try {
  await applicationContext.getUseCaseHelpers().acquireLock({
    applicationContext,
    identifier: 'case|123-20',
  });
} catch (err) {
  if (err instanceof ServiceUnavailableError) {
    await handleLockError(applicationContext, {
      docketNumber
    });
  }
  throw err;
}
```

### Retrying in the Lambda Execution

You may wish to retry acquiring the lock before failing. This may make sense on a Lambda that is invoked by Cron or SQS Messages rather than API Gateway. These are usually long running lambdas, where it would make sense to perform multiple attempts before failing.

```typescript
await applicationContext.getUseCaseHelpers().acquireLock({
  applicationContext,
  identifier: 'case|123-20',
  retries: 10, // the default is 0
  waitTime: 5000 // the default is 3000 (3 seconds)
});
```

This will perform a maximum of 11 attempts to acquire the lock waiting 5 seconds in between each attempt.

### Time to Live

By default, locks will last for a maximum of 30 seconds. You can specify another number. 900 seconds (15 minutes) makes sense for long-running async Lambdas:

```typescript
await applicationContext.getUseCaseHelpers().acquireLock({
  applicationContext,
  identifier: 'case|123-20',
  ttl: 900, // default is 30
});
```

### Synchronous API Retries

The proxy layer is configured to auto retry 5 times for any `PUT`, `POST`, or `DELETE` calls that fail due to a 504 error being returned by the API Gateway. Check out [`requests.ts`](shared/src/proxies/requests.ts).

### Asynchronous API Retries

These requests immediately return a `200`, and so you will need to rely on websocket messages to perform a retry of your request. The above [Advanced Handling](#advanced-handling-on-failure) will help show you how to initiate the websocket message.

To process those websocket messages, [`socketRouter`](web-client/src/providers/socketRouter.ts) routes messages with the action `retry_async_request` to [`retryAsyncRequestSequence`](web-client/src/presenter/sequences/retryAsyncRequestSequence.ts). This sequence calls an action that waits a few seconds, and then it calls [`retryAsyncRequestAction`](web-client/src/presenter/sequences/retryAsyncRequestSequence.ts) to perform the retry attempt.

Simply add your specific `requestToRetry` to the `switch` statement, and it will call the interactor with the original request:

```typescript
// retryAsyncRequestAction.ts

  switch (props.requestToRetry) {
    // ...
    case 'update_something':
      func = applicationContext.getUseCases().updateSomethingInteractor;
      break;
  }
```

## Feature Flag

This functionality is currently behind a feature flag. When the feature flag is off, interactors will still create locks on entities and log when they would have encountered a locked or unlocked entity, (i.e., when a race condition may or may not have occurred). The request will always be processed by the interactor.

If the feature flag is enabled, then the system will throw a 504 error and any special handling when a locked entity is encountered. The request will only be processed by the interactor if a lock was acquired on all specified entities.

The key for the feature flag is `entity-locking-feature-flag`, and it is enabled when it is set to `true`. It's disabled when set to `false`.

## Future considerations

* Throw an error if a `ttl` is set to greater than a certain threshold (15 minutes?)
