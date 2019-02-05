exports.getWorkItemsBySection = async ({ applicationContext, section }) => {
  const userToken = applicationContext.getCurrentUser().userId; //TODO refactor for jwt
  const rand = Math.random();
  console.log('PRE gwibsp', rand);

  const generatePromise = (millis, value) => {
    return new Promise(resolve => {
      setTimeout(() => resolve(value), millis);
    });
  };

  let response;
  const client = applicationContext.getHttpClient();
  const clientGetPromise = client.get(
    `${applicationContext.getBaseUrl()}/workitems?section=${section}`,
    {
      timeout: 5000,
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    },
  );

  // const getPromise = generatePromise(500, [{ hi: 'there' }]);
  // getPromise.rand = rand;
  // console.log('Got the promise', getPromise, rand);

  response = await clientGetPromise;
  const data = await generatePromise(3000, response.data);

  console.log('Got resolved promise', rand);

  console.log('POST gwibsp', data.length, rand);
  return data;
};
