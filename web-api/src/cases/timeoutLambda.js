exports.timeoutLambda = async () =>
  new Promise(resolve => {
    setTimeout(resolve, 5000);
  });
