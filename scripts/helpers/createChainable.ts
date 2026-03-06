export const createChainable = (
  executeResult: unknown,
  executeTakeFirstResult?: unknown,
) => {
  const joinChain = {
    onRef: () => joinChain,
  };
  const chain = {
    crossJoin: () => chain,
    distinct: () => chain,
    leftJoin: (
      _table: string,
      joinCb: (j: typeof joinChain) => typeof joinChain,
    ) => {
      joinCb(joinChain);
      return chain;
    },
    limit: () => chain,
    select: () => chain,
    selectFrom: () => chain,
    where: (a?: unknown, _b?: unknown, _c?: unknown) => {
      if (typeof a === 'function') {
        a(qb);
      }
      return chain;
    },
    execute: () => Promise.resolve(executeResult),
    executeTakeFirst: () =>
      Promise.resolve(
        executeTakeFirstResult !== undefined
          ? executeTakeFirstResult
          : executeResult,
      ),
  };
  const qb = Object.assign(() => chain, { or: () => chain }) as {
    (): typeof chain;
    or: () => typeof chain;
  };
  return chain;
};