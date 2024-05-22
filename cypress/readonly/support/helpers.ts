import { Interception } from 'cypress/types/net-stubbing';

export const isValidRequest = ({ response }: Interception) => {
  if (!response) throw new Error('response was not found');
  expect(response.statusCode).to.eq(200);
  expect(response.headers['content-type']).to.contain('application/json');
};
