exports.isValidRequest = ({ response }) => {
  expect(response.statusCode).to.eq(200);
  expect(response.headers['content-type']).to.contain('application/json');
};
