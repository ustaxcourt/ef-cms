import {
  ChangeResourceRecordSetsCommand,
  ListHostedZonesByNameCommand,
  Route53Client,
} from '@aws-sdk/client-route-53';
import {
  CloudFrontClient,
  GetDistributionCommand,
  GetDistributionConfigCommand,
  ListDistributionsCommand,
  UpdateDistributionCommand,
} from '@aws-sdk/client-cloudfront';

const cloudfront = new CloudFrontClient({
  maxAttempts: 4,
  region: 'us-east-1',
});
const route53 = new Route53Client({
  region: 'us-east-1',
});

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const sendCloudFrontWithRetry = async <T>(
  operation: () => Promise<T>,
  retries = 3,
): Promise<T> => {
  let lastError: unknown;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await operation();
    } catch (err) {
      lastError = err;

      if (attempt === retries) {
        throw err;
      }

      await sleep(60_000);
    }
  }

  throw lastError;
};

const waitForDistributionDeployed = async (
  distributionId: string,
  retries = 10,
) => {
  let lastStatus = 'Unknown';

  for (let attempt = 0; attempt <= retries; attempt++) {
    const result = await cloudfront.send(
      new GetDistributionCommand({ Id: distributionId }),
    );

    lastStatus = result.Distribution?.Status ?? 'Unknown';

    if (lastStatus === 'Deployed') {
      return;
    }

    if (attempt < retries) {
      await sleep(30_000);
    }
  }

  throw new Error(
    `CloudFront distribution ${distributionId} did not reach Deployed status after ${retries + 1} attempts. Last observed status: ${lastStatus}.`,
  );
};

export const switchUiColors = async ({
  currentColor,
  deployingColor,
  efcmsDomain,
  publicUi,
}: {
  currentColor: string;
  deployingColor: string;
  efcmsDomain: string;
  publicUi: boolean;
}) => {
  const { DistributionList } = await cloudfront.send(
    new ListDistributionsCommand({}),
  );
  const distributions =
    DistributionList && 'Items' in DistributionList && DistributionList.Items
      ? DistributionList.Items
      : [];

  const updateDistributionCommands: {
    distributionId: string;
    command: UpdateDistributionCommand;
  }[] = [];

  let DNSName = '';
  const generalDomainAlias = publicUi ? efcmsDomain : `app.${efcmsDomain}`;

  const currentColorDomainAlias = publicUi
    ? `${currentColor}.${efcmsDomain}`
    : `app-${currentColor}.${efcmsDomain}`;
  const currentColorDistribution = distributions.find(distribution =>
    distribution.Aliases?.Items?.find(
      alias => alias === currentColorDomainAlias,
    ),
  );
  if (currentColorDistribution?.Id) {
    const currentColorConfig = await cloudfront.send(
      new GetDistributionConfigCommand({
        Id: currentColorDistribution.Id,
      }),
    );
    if (currentColorConfig.DistributionConfig?.Aliases) {
      currentColorConfig.DistributionConfig.Aliases.Items = [
        currentColorDomainAlias,
      ];
      currentColorConfig.DistributionConfig.Aliases.Quantity = 1;
    }
    updateDistributionCommands.push({
      distributionId: currentColorDistribution.Id,
      command: new UpdateDistributionCommand({
        DistributionConfig: currentColorConfig.DistributionConfig,
        Id: currentColorDistribution.Id,
        IfMatch: currentColorConfig.ETag,
      }),
    });
  }

  const deployingColorDomainAlias = publicUi
    ? `${deployingColor}.${efcmsDomain}`
    : `app-${deployingColor}.${efcmsDomain}`;
  const deployingColorDistribution = distributions.find(distribution =>
    distribution.Aliases?.Items?.find(
      alias => alias === deployingColorDomainAlias,
    ),
  );
  if (deployingColorDistribution?.Id) {
    const deployingColorConfig = await cloudfront.send(
      new GetDistributionConfigCommand({
        Id: deployingColorDistribution.Id,
      }),
    );
    if (deployingColorConfig.DistributionConfig?.Aliases) {
      deployingColorConfig.DistributionConfig.Aliases.Quantity = 2;
      deployingColorConfig.DistributionConfig.Aliases.Items = [
        deployingColorDomainAlias,
        generalDomainAlias,
      ];
    }
    if (deployingColorDistribution.DomainName) {
      DNSName = deployingColorDistribution.DomainName;
    }

    updateDistributionCommands.push({
      distributionId: deployingColorDistribution.Id,
      command: new UpdateDistributionCommand({
        DistributionConfig: deployingColorConfig.DistributionConfig,
        Id: deployingColorDistribution.Id,
        IfMatch: deployingColorConfig.ETag,
      }),
    });
  }

  for (const { distributionId, command } of updateDistributionCommands) {
    await sendCloudFrontWithRetry(() => cloudfront.send(command));
    await waitForDistributionDeployed(distributionId);
  }
  const zone = await route53.send(
    new ListHostedZonesByNameCommand({ DNSName: `${efcmsDomain}.` }),
  );

  if (
    DNSName &&
    zone &&
    'HostedZones' in zone &&
    zone.HostedZones &&
    zone.HostedZones[0] &&
    'Id' in zone.HostedZones[0]
  ) {
    const HostedZoneId = zone.HostedZones[0].Id;
    await route53.send(
      new ChangeResourceRecordSetsCommand({
        ChangeBatch: {
          Changes: [
            {
              Action: 'UPSERT',
              ResourceRecordSet: {
                AliasTarget: {
                  DNSName,
                  EvaluateTargetHealth: false,
                  HostedZoneId: 'Z2FDTNDATAQYW2', // this magic number is the zone for all cloud front distributions on AWS
                },
                Name: generalDomainAlias,
                Type: 'A',
              },
            },
          ],
          Comment: `The UI for ${generalDomainAlias}`,
        },
        HostedZoneId,
      }),
    );
  }
};
