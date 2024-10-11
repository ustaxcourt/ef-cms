export const mockFactory = (method: string, returnValue: any = undefined) => {
  return {
    [method]: jest.fn(() => {
      console.debug(`${method} was not implemented, using default mock`);
      return returnValue;
    }),
  };
};
