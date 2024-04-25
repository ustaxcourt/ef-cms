import {
  ChangeResourceRecordSetsCommand,
  ListHostedZonesByNameCommand,
  Route53Client,
} from '@aws-sdk/client-route-53';
import {
  CloudFrontClient,
  GetDistributionConfigCommand,
  ListDistributionsCommand,
  UpdateDistributionCommand,
} from '@aws-sdk/client-cloudfront';
import { requireEnvVars } from '../shared/admin-tools/util';

requireEnvVars([
  'CURRENT_COLOR',
  'DEPLOYING_COLOR',
  'EFCMS_DOMAIN',
  'ZONE_NAME',
]);

const { CURRENT_COLOR, DEPLOYING_COLOR, EFCMS_DOMAIN, ZONE_NAME } = process.env;

const cloudfront = new CloudFrontClient({ maxRetries: 3 });
const route53 = new Route53Client();

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  const { Items: distributions } = await cloudfront.send(
    new ListDistributionsCommand({}),
  );

  const currentColorDistribution = distributions.find(distribution =>
    distribution.Aliases.Items.find(
      alias => alias === `app-${CURRENT_COLOR}.${EFCMS_DOMAIN}`,
    ),
  );

  const deployingColorDistribution = distributions.find(distribution =>
    distribution.Aliases.Items.find(
      alias => alias === `app-${DEPLOYING_COLOR}.${EFCMS_DOMAIN}`,
    ),
  );

  const currentColorConfig = await cloudfront.send(
    new GetDistributionConfigCommand({
      Id: currentColorDistribution.Id,
    }),
  );

  const deployingColorConfig = await cloudfront.send(
    new GetDistributionConfigCommand({
      Id: deployingColorDistribution.Id,
    }),
  );

  currentColorConfig.DistributionConfig.Aliases.Items = [
    `app-${CURRENT_COLOR}.${EFCMS_DOMAIN}`,
  ];
  currentColorConfig.DistributionConfig.Aliases.Quantity = 1;

  deployingColorConfig.DistributionConfig.Aliases.Quantity = 2;
  deployingColorConfig.DistributionConfig.Aliases.Items = [
    `app-${DEPLOYING_COLOR}.${EFCMS_DOMAIN}`,
    `app.${EFCMS_DOMAIN}`,
  ];

  await cloudfront.send(
    new UpdateDistributionCommand({
      DistributionConfig: currentColorConfig.DistributionConfig,
      Id: currentColorDistribution.Id,
      IfMatch: currentColorConfig.ETag,
    }),
  );
  try {
    await cloudfront.send(
      new UpdateDistributionCommand({
        DistributionConfig: deployingColorConfig.DistributionConfig,
        Id: deployingColorDistribution.Id,
        IfMatch: deployingColorConfig.ETag,
      }),
    );
  } catch (e) {
    // Need to retry after one minute as throttling occurs after the previous update request.
    setTimeout(async () => {
      await cloudfront.send(
        new UpdateDistributionCommand({
          DistributionConfig: deployingColorConfig.DistributionConfig,
          Id: deployingColorDistribution.Id,
          IfMatch: deployingColorConfig.ETag,
        }),
      );
    }, 60000);
  }

  const zone = await route53.send(
    new ListHostedZonesByNameCommand({ DNSName: `${ZONE_NAME}.` }),
  );

  const zoneId = zone.HostedZones[0].Id;

  await route53.send(
    new ChangeResourceRecordSetsCommand({
      ChangeBatch: {
        Changes: [
          {
            Action: 'UPSERT',
            ResourceRecordSet: {
              AliasTarget: {
                DNSName: deployingColorDistribution.DomainName,
                EvaluateTargetHealth: false,
                HostedZoneId: 'Z2FDTNDATAQYW2', // this magic number is the zone for all cloud front distributions on AWS
              },
              Name: `app.${EFCMS_DOMAIN}`,
              Type: 'A',
            },
          },
        ],
        Comment: `The UI for app.${EFCMS_DOMAIN}`,
      },
      HostedZoneId: zoneId,
    }),
  );
})();
