import { createChainable } from './createChainable.jest';

describe('createChainable', () => {
  describe('chain methods', () => {
    it('returns chain from crossJoin', () => {
      const chain = createChainable(null);
      expect(chain.crossJoin()).toBe(chain);
    });

    it('returns chain from distinct', () => {
      const chain = createChainable(null);
      expect(chain.distinct()).toBe(chain);
    });

    it('returns chain from limit', () => {
      const chain = createChainable(null);
      expect(chain.limit()).toBe(chain);
    });

    it('returns chain from select', () => {
      const chain = createChainable(null);
      expect(chain.select()).toBe(chain);
    });

    it('returns chain from selectFrom', () => {
      const chain = createChainable(null);
      expect(chain.selectFrom()).toBe(chain);
    });
  });

  describe('leftJoin', () => {
    it('calls join callback with joinChain and returns chain', () => {
      const chain = createChainable(null);
      const joinCb = jest.fn(j => j.onRef());
      const result = chain.leftJoin('some_table', joinCb);

      expect(joinCb).toHaveBeenCalledTimes(1);
      const joinArg = joinCb.mock.calls[0][0];
      expect(joinArg).toHaveProperty('onRef');
      expect(typeof joinArg.onRef).toBe('function');
      expect(joinArg.onRef()).toBe(joinArg);
      expect(result).toBe(chain);
    });
  });

  describe('where', () => {
    it('returns chain when called with no arguments', () => {
      const chain = createChainable(null);
      expect(chain.where()).toBe(chain);
    });

    it('returns chain when first arg is not a function', () => {
      const chain = createChainable(null);
      expect(chain.where('column', '=', 'value')).toBe(chain);
      expect(chain.where(null)).toBe(chain);
      expect(chain.where(123)).toBe(chain);
    });

    it('calls callback with qb when first arg is a function', () => {
      const chain = createChainable(null);
      const whereCb = jest.fn(qb => {
        expect(typeof qb).toBe('function');
        expect(qb()).toBe(chain);
        expect(qb.or).toBeDefined();
        expect(typeof qb.or).toBe('function');
        expect(qb.or()).toBe(chain);
        return chain;
      });
      const result = chain.where(whereCb);

      expect(whereCb).toHaveBeenCalledTimes(1);
      expect(result).toBe(chain);
    });
  });

  describe('execute', () => {
    it('resolves with executeResult', async () => {
      const result = { id: 1, name: 'test' };
      const chain = createChainable(result);
      await expect(chain.execute()).resolves.toBe(result);
    });

    it('resolves with null when executeResult is null', async () => {
      const chain = createChainable(null);
      await expect(chain.execute()).resolves.toBeNull();
    });

    it('resolves with array when executeResult is array', async () => {
      const result = [{ id: 1 }, { id: 2 }];
      const chain = createChainable(result);
      await expect(chain.execute()).resolves.toEqual(result);
    });
  });

  describe('executeTakeFirst', () => {
    it('resolves with executeTakeFirstResult when provided', async () => {
      const executeResult = [{ id: 1 }, { id: 2 }];
      const executeTakeFirstResult = { id: 1 };
      const chain = createChainable(executeResult, executeTakeFirstResult);
      await expect(chain.executeTakeFirst()).resolves.toBe(
        executeTakeFirstResult,
      );
    });

    it('resolves with executeResult when executeTakeFirstResult is undefined', async () => {
      const result = { id: 1 };
      const chain = createChainable(result);
      await expect(chain.executeTakeFirst()).resolves.toBe(result);
    });

    it('resolves with executeResult when executeTakeFirstResult is not passed', async () => {
      const result = [1, 2, 3];
      const chain = createChainable(result);
      await expect(chain.executeTakeFirst()).resolves.toEqual(result);
    });
  });

  describe('chaining', () => {
    it('supports full method chaining', async () => {
      const result = { count: 5 };
      const chain = createChainable(result, result);

      const chained = chain
        .selectFrom()
        .select()
        .crossJoin()
        .leftJoin('users', j => j.onRef())
        .where()
        .distinct()
        .limit()
        .where('col', '=', 'val');

      expect(chained).toBe(chain);
      await expect(chained.execute()).resolves.toBe(result);
      await expect(chained.executeTakeFirst()).resolves.toBe(result);
    });

    it('supports where with function callback in chain', async () => {
      const result = { id: 1 };
      const chain = createChainable(result);

      const chained = chain.where(qb => {
        qb.or();
        return chain;
      });

      expect(chained).toBe(chain);
      await expect(chained.executeTakeFirst()).resolves.toBe(result);
    });
  });
});
