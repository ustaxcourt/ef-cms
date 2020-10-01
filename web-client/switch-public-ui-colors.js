const AWS = require('aws-sdk');

const check = (value, message) => {
  if (!value) {
    console.log(message);
    process.exit(1);
  }
};

const { CURRENT_COLOR, DEPLOYING_COLOR, ENV, ZONE_NAME } = process.env;

check(CURRENT_COLOR, 'You must have CURRENT_COLOR set in your environment');
check(DEPLOYING_COLOR, 'You must have DEPLOYING_COLOR set in your environment');
check(ZONE_NAME, 'You must have ZONE_NAME set in your environment');
check(ENV, 'You must have ENV set in your environment');

const cloudfront = new AWS.CloudFront();
const route53 = new AWS.Route53();

const run = async () => {
  const { Items: distributions } = await cloudfront
    .listDistributions({})
    .promise();

  const currentColorDistribution = distributions.find(distribution =>
    distribution.Aliases.Items.find(
      alias => alias === `${CURRENT_COLOR}.${ENV}.${ZONE_NAME}`,
    ),
  );

  const deployingColorDistribution = distributions.find(distribution =>
    distribution.Aliases.Items.find(
      alias => alias === `${DEPLOYING_COLOR}.${ENV}.${ZONE_NAME}`,
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
    `${CURRENT_COLOR}.${ENV}.${ZONE_NAME}`,
  ];
  currentColorConfig.DistributionConfig.Aliases.Quantity = 1;

  deployingColorConfig.DistributionConfig.Aliases.Quantity = 2;
  deployingColorConfig.DistributionConfig.Aliases.Items = [
    `${DEPLOYING_COLOR}.${ENV}.${ZONE_NAME}`,
    `${ENV}.${ZONE_NAME}`,
  ];

  await cloudfront
    .updateDistribution({
      DistributionConfig: currentColorConfig.DistributionConfig,
      Id: currentColorDistribution.Id,
      IfMatch: currentColorConfig.ETag,
    })
    .promise();

  await cloudfront
    .updateDistribution({
      DistributionConfig: deployingColorConfig.DistributionConfig,
      Id: deployingColorDistribution.Id,
      IfMatch: deployingColorConfig.ETag,
    })
    .promise();

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
              Name: `${ENV}.${ZONE_NAME}`,
              Type: 'A',
            },
          },
        ],
        Comment: `The UI for ${ENV}.${ZONE_NAME}`,
      },
      HostedZoneId: zoneId,
    })
    .promise();
};

run();
