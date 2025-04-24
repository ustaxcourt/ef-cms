import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { createApplicationContext } from '@web-api/applicationContext';

async function app() {
  console.log('RUNNING OUR SCRIPT');
  const applicationContext = createApplicationContext();
  await applicationContext
    .getUseCases()
    .setNoticesForCalendaredTrialSessionInteractor(
      applicationContext,
      {
        clientConnectionId: '123',
        trialSessionId: 'a3fea3ac-b5f3-4610-8924-4858812343f0',
      },
      {} as UnknownAuthUser, //TODO UPDATE WITH REAL USER
    );
  console.log('COMPLETED SCRIPT');
}

void app();
