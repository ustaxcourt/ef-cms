import ErrorFactory from './presenter/errors/ErrorFactory';

export default function tryCatchDecorator(useCases) {
  function decorate(method) {
    return function() {
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
}
