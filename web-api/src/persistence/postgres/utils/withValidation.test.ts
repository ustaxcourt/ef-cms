import { RawWorkItem } from '@shared/business/entities/WorkItem';
import { MOCK_WORK_ITEM } from '@shared/test/mockWorkItem';
import { EntityNotValidatedError } from '@web-api/errors/errors';
import { withValidation } from '@web-api/persistence/postgres/utils/withValidation';

describe('withValidation', () => {
  it('should throw an error when the arguments passed into a function are an entity and have not been validated', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    function somePersistenceMethod(workItem: RawWorkItem) {}
    const somePersistenceMethodWithValidation = withValidation(
      somePersistenceMethod,
    );

    expect(() => somePersistenceMethodWithValidation(MOCK_WORK_ITEM)).toThrow(
      EntityNotValidatedError,
    );
  });

  it('should throw an error when deeply nested arguments in an array have not been validated', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    function somePersistenceMethod(arg: any) {}
    const somePersistenceMethodWithValidation = withValidation(
      somePersistenceMethod,
    );

    const fakeDeeplyNestedEntity = [{}, [[MOCK_WORK_ITEM]]];

    expect(() =>
      somePersistenceMethodWithValidation(fakeDeeplyNestedEntity),
    ).toThrow(EntityNotValidatedError);
  });

  it('should throw an error when deeply nested arguments in an object have not been validated', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    function somePersistenceMethod(arg: any) {}
    const somePersistenceMethodWithValidation = withValidation(
      somePersistenceMethod,
    );

    const fakeDeeplyNestedEntity = {
      applicationContext: 'stuff',
      obj: { workItem: MOCK_WORK_ITEM },
    };

    expect(() =>
      somePersistenceMethodWithValidation(fakeDeeplyNestedEntity),
    ).toThrow(EntityNotValidatedError);
  });

  it('should not throw an error for arguments that are not entities', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    function somePersistenceMethod(arg: any) {}
    const somePersistenceMethodWithValidation = withValidation(
      somePersistenceMethod,
    );

    const randomData = [
      { isValidated: false },
      {
        favoriteAnimal: 'penguin',
        hasColor: true,
        multipleColors: true,
        type: 'emperor',
        children: {
          name: 'mumble',
          born: 2005,
        },
      },
      [[[[{ level: 'super deep' }]]]],
    ];

    expect(() => somePersistenceMethodWithValidation(randomData)).not.toThrow();
  });

  it('should not throw an error when the arguments passed into a function are validated', () => {
    function somePersistenceMethod(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      workItem: RawWorkItem & { isValidated: boolean },
    ) {}
    const somePersistenceMethodWithValidation = withValidation(
      somePersistenceMethod,
    );

    expect(() =>
      somePersistenceMethodWithValidation({
        ...MOCK_WORK_ITEM,
        isValidated: true,
      }),
    ).not.toThrow();
  });

  it('should only validate top level entities', () => {
    function somePersistenceMethod(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      thing,
    ) {}
    const somePersistenceMethodWithValidation = withValidation(
      somePersistenceMethod,
    );
    const nestedEntities = {
      entityName: 'PandaBear',
      isValidated: true,
      docketEntries: [{ entityName: 'DocketEntry', isValidated: false }],
    };

    expect(() =>
      somePersistenceMethodWithValidation(nestedEntities),
    ).not.toThrow();
  });

  it('should validate all top level entities', () => {
    function somePersistenceMethod(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      thing,
    ) {}
    const somePersistenceMethodWithValidation = withValidation(
      somePersistenceMethod,
    );
    const nestedEntities = {
      thing1: {
        entityName: 'PandaBear',
        isValidated: true,
      },
      thing2: {
        entityName: 'Puma',
        isValidated: undefined,
      },
    };

    expect(() => somePersistenceMethodWithValidation(nestedEntities)).toThrow(
      EntityNotValidatedError,
    );
  });
});
