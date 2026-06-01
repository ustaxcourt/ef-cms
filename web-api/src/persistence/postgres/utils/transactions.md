## Problems to solve
- The design is meant to take into account the following:
  - We want to be as flexible/granular as possible. We should be able to wrap only what we want in a transaction.
  - We want to avoid one connection calling BEGIN twice, which will cause an error.
    - Example 1: await Promise.all(transaction, transaction) could cause problems if we don't ensure that each transaction gets its own connection, or each transaction waits for the other.
    - Example 2: a transaction within a transaction should know, "Oh, I'm already part of a larger transaction, so I should just do my thing without trying to start a transaction. I will let the outer transaction handle the rollback/commit."
  - We want to make sure that we only index to OpenSearch when the transaction is committed.

## Implementation notes
- The implementation is a wrapper function that takes in an arbitrary callback function. A transaction "knows" it is nested by means of state passed in to children processes via AsyncLocalStorage.
  - Pros:
    - Kysely prefers working with callback functions; their transaction API, for instance, is built this way. A wrapper function with a callback is therefore a "natural" approach.
    - A wrapper function ensures that BEGIN/ROLLBACK/COMMIT is handled automatically. In other words, a developer can't forget to end the transaction, or can't accidentally call a transaction when one is already going on.
    - A wrapper function is easy to use.
    - Minimal entanglement of database logic with application code; e.g., no passing around transaction ids.
  - Cons:
    - The use of AsyncLocalStorage is sort of "magic" behind-the-scenes coordination that makes the code potentially trickier to debug.
    - You cannot look at an arbitrary function and just "tell" that it is in a nested transaction. You need to see the outer withTransaction and follow the callback chain in order to "see" the transaction as a whole.
- An alternative approach was also considered. In this approach, we called startTransaction(transactionId?: string) and endTransaction(transactionId). startTransaction stored transaction data in a global mapping object (which played a role roughly equivalent to AsyncLocalStorage) and returned a uuid that was a key into this object. (The transactionId argument was optional. If present, this was the signal that "I am a nested transaction, don't try to start a new one.") endTransaction removed the transaction data from the global mapping object and committed.
  - Pros:
    - No AsyncLocalStorage magic. You can see all the transaction data in the global mapping object.
    - Because you need to pass in a transaction id to children functions, you can "tell" that some arbitrary function might be part of a transaction.
    - Some explicitness with startTransaction and endTransaction that is lacking in withTransaction.
  - Cons:
    - The big one: a developer can mess this up. What if they forget to call endTransaction? What if they forget to pass in transactionId to a nested transaction? What if we mismanage transaction ids somehow? Etc.
    - Passing around the transaction id coupled application code more closely to database implementation.
- The first solution was chosen because its "magic" was localized to a few small spots, and because it seemed less likely to lead to developer-caused bugs.

## onTransactionCommit memory concerns
- Please be cognizant that adding thousands of calls to onTransactionCommit to run when the transaction finishes may lead to running out of memory. This likely would only happen when running one time scripts. 