export const mockFactory = (method: string) => {
  return {
    [method]: jest.fn(() =>
      console.debug(`${method} was not implemented, using default mock`),
    ),
  };
};
