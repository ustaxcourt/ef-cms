import { deleteAllCypressTestAccounts, deleteAllIrsCypressTestAccounts } from '../../cypress/helpers/cypressTasks/cognito/cognito-helpers';

async function main(): Promise<void> {
  try {
    await deleteAllCypressTestAccounts();
  } catch (err) {
    console.error('Error deleting standard Cypress test accounts', err);
  }

  try {
    await deleteAllIrsCypressTestAccounts();
  } catch (err) {
    console.error('Error deleting IRS Cypress test accounts', err);
  }
}

main().catch(err => {
  console.error('Unexpected error during cleanup', err);
  process.exit(1);
});


