export const mockFactory = method => {
  return {
    [method]: jest.fn(() =>
      console.debug(`${method} was not implemented, using default mock`),
    ),
  };
};
