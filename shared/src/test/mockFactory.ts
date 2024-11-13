export const mockFactory = (method: string) => {
  return {
    [method]: jest.fn(() =>
      console.debug(`${method} was not implemented, using default mock`),
    ),
  };
};

export const mockEntireFile = ({
  keepImplementation = false,
  module,
}: {
  module: string;
  keepImplementation?: boolean;
}) => {
  const originalModule = jest.requireActual(module);

  Object.keys(originalModule).forEach(method => {
    if (typeof originalModule[method] === 'function') {
      const dummyImplementation = () =>
        console.debug(`${method} was not implemented, using default mock`);

      originalModule[method] = keepImplementation
        ? jest.fn(originalModule[method])
        : jest.fn(dummyImplementation);
    }
  });

  return originalModule;
};
