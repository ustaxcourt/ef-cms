const AWS = require('aws-sdk');

const check = (value, message) => {
  if (!value) {
    console.log(message);
    process.exit(1);
  }
};

const { CURRENT_COLOR, DEPLOYING_COLOR, EFCMS_DOMAIN, ENV, ZONE_NAME } =
  process.env;

check(CURRENT_COLOR, 'You must have CURRENT_COLOR set in your environment');
check(DEPLOYING_COLOR, 'You must have DEPLOYING_COLOR set in your environment');
check(EFCMS_DOMAIN, 'You must have EFCMS_DOMAIN set in your environment');
check(ZONE_NAME, 'You must have ZONE_NAME set in your environment');
check(ENV, 'You must have ENV set in your environment');

const cloudfront = new AWS.CloudFront({ maxRetries: 3 });
const route53 = new AWS.Route53();

const run = async () => {
  const { Items: distributions } = await cloudfront
    .listDistributions({})
    .promise();

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

  const currentColorConfig = await cloudfront
    .getDistributionConfig({
      Id: currentColorDistribution.Id,
    })
    .promise();

  const deployingColorConfig = await cloudfront
    .getDistributionConfig({
      Id: deployingColorDistribution.Id,
    })
    .promise();

  currentColorConfig.DistributionConfig.Aliases.Items = [
    `app-${CURRENT_COLOR}.${EFCMS_DOMAIN}`,
  ];
  currentColorConfig.DistributionConfig.Aliases.Quantity = 1;

  deployingColorConfig.DistributionConfig.Aliases.Quantity = 2;
  deployingColorConfig.DistributionConfig.Aliases.Items = [
    `app-${DEPLOYING_COLOR}.${EFCMS_DOMAIN}`,
    `app.${EFCMS_DOMAIN}`,
  ];

  await cloudfront
    .updateDistribution({
      DistributionConfig: currentColorConfig.DistributionConfig,
      Id: currentColorDistribution.Id,
      IfMatch: currentColorConfig.ETag,
    })
    .promise();
  try {
    await cloudfront
      .updateDistribution({
        DistributionConfig: deployingColorConfig.DistributionConfig,
        Id: deployingColorDistribution.Id,
        IfMatch: deployingColorConfig.ETag,
      })
      .promise();
  } catch (e) {
    // Need to retry after one minute as throttling occurs after the previous update request.
    setTimeout(async () => {
      await cloudfront
        .updateDistribution({
          DistributionConfig: deployingColorConfig.DistributionConfig,
          Id: deployingColorDistribution.Id,
          IfMatch: deployingColorConfig.ETag,
        })
        .promise();
    }, 60000);
  }

  const zone = await route53
    .listHostedZonesByName({ DNSName: `${ZONE_NAME}.` })
    .promise();

  const zoneId = zone.HostedZones[0].Id;

  await route53
    .changeResourceRecordSets({
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
    })
    .promise();
};

run();
