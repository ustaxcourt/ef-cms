import { GetParametersCommand, SSMClient } from '@aws-sdk/client-ssm';
import {
  Route53Client,
  UpdateHealthCheckCommand,
  UpdateHealthCheckRequest,
} from '@aws-sdk/client-route-53';

const check = (value: string | undefined, message: string) => {
  if (!value) {
    console.log(message);
    process.exit(1);
  }
};

const { DEPLOYING_COLOR, ENV } = process.env;

check(DEPLOYING_COLOR, 'You must have DEPLOYING_COLOR set in your environment');
check(ENV, 'You must have ENV set in your environment');

async function main() {
  const ssmClient = new SSMClient({ region: 'us-east-1' });

  const ssmCommand = new GetParametersCommand({
    Names: [
      `terraform-${ENV}-east-${DEPLOYING_COLOR}-params`,
      `terraform-${ENV}-west-${DEPLOYING_COLOR}-params`,
    ],
  });
  const ssmResponse = await ssmClient.send(ssmCommand);
  console.log('ssmResponse:', ssmResponse);

  const params = ssmResponse.Parameters!.map(param => {
    return JSON.parse(param.Value!);
  });

  const client = new Route53Client({ defaultsMode: 'cross-region' });

  for (const param of params) {
    const input: UpdateHealthCheckRequest = {
      FullyQualifiedDomainName: param.fqdn,
      HealthCheckId: param.healthCheckId,
    };
    console.log('route53 input:', input);
    const command = new UpdateHealthCheckCommand(input);
    const response = await client.send(command);
    console.log('Response: ', response);
  }
}

main();
