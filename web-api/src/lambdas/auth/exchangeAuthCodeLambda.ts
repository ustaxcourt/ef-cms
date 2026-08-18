import { genericHandler } from '../../genericHandler';
import { exchangeAuthCodeInteractor } from '@web-api/business/useCases/auth/exchangeAuthCodeInteractor';

export const exchangeAuthCodeLambda = event =>
  genericHandler(
    event,
    async ({ applicationContext }) => {
      const { authCode } = JSON.parse(event.body);

      return exchangeAuthCodeInteractor(applicationContext, {
        authCode,
      });
    },
    { bypassMaintenanceCheck: true },
  );
