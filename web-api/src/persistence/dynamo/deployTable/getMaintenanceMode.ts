import { ServerApplicationContext } from '@web-api/applicationContext';
import { getSsmParameter } from '@web-api/persistence/ssmClientService';

export const getMaintenanceMode = ({
  applicationContext,
}: {
  applicationContext: ServerApplicationContext;
}) =>
  getSsmParameter({
    applicationContext,
    parameterName: 'maintenance-mode',
  });
