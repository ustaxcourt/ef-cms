import { GetParametersCommand, SSMClient } from '@aws-sdk/client-ssm';
import {
  Route53Client,
  UpdateHealthCheckCommand,
  UpdateHealthCheckRequest,
} from '@aws-sdk/client-route-53';
import { requireEnvVars } from '../shared/admin-tools/util';

requireEnvVars(['DEPLOYING_COLOR', 'ENABLE_HEALTH_CHECKS', 'ENV']);

const { DEPLOYING_COLOR, ENABLE_HEALTH_CHECKS, ENV } = process.env;

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  if (ENABLE_HEALTH_CHECKS !== '1') {
    console.log(
      'ENABLE_HEALTH_CHECKS is turned off, will not switch health check colors',
    );
    return;
  }
  const ssmClient = new SSMClient({ region: 'us-east-1' });

  const ssmCommand = new GetParametersCommand({
    Names: [
      `terraform-${ENV}-us-east-1-${DEPLOYING_COLOR}-failover-params`,
      `terraform-${ENV}-us-west-1-${DEPLOYING_COLOR}-failover-params`,
    ],
  });
  const ssmResponse = await ssmClient.send(ssmCommand);

  console.log('ssm response:', ssmResponse);

  const params = ssmResponse.Parameters!.map(param => {
    return JSON.parse(param.Value!);
  });

  const client = new Route53Client({
    defaultsMode: 'cross-region',
    region: 'us-east-1',
  });

  for (const param of params) {
    const input: UpdateHealthCheckRequest = {
      Disabled: false,
      FullyQualifiedDomainName: param.fqdn,
      HealthCheckId: param.healthCheckId,
    };
    const command = new UpdateHealthCheckCommand(input);
    const route53Response = await client.send(command);

    console.log('route53 response:', route53Response);
  }
})();
