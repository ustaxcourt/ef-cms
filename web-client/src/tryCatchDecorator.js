import { ErrorFactory } from './presenter/errors/ErrorFactory';

/**
 * Decorates a list of use cases so that they return cerebral specific errors from the ErrorFactory when exceptions occur
 *
 * @param {Array} useCases the use case functions to decorate
 * @returns {undefined} does not return anything
 */
export const tryCatchDecorator = useCases => {
  /**
   * catches and throws any exceptions produced from method with a new error based on what the ErrorFactory.getError returns
   *
   * @param {*} method the use case method to decorate
   * @returns {*} the result of method
   */
  function decorate(method) {
    return function () {
      const response = method.apply(
        null,
        Array.prototype.slice.call(arguments),
      );
      if (response && response.then) {
        return new Promise((resolve, reject) => {
          response.then(resolve).catch(e => {
            reject(ErrorFactory.getError(e));
          });
        });
      }
      return response;
    };
  }

  Object.keys(useCases).forEach(key => {
    useCases[key] = decorate(useCases[key]);
  });
};
