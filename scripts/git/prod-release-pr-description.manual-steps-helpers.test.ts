import {
  extractManualSteps,
  renderManualSteps,
} from './prod-release-pr-description.manual-steps-helpers';

describe('prod-release-pr-description manual steps', () => {
  it('extracts deployment sections and surrounding text', () => {
    const manualSteps = extractManualSteps(
      [
        '## Manual Deployment Steps',
        '',
        '### Before Deployment',
        '',
        '#### Prepare the deployment',
        '',
        'Run this before deploying:',
        '',
        '```bash',
        'npm run deploy:prepare',
        '```',
        '',
        '### After Deployment',
        '',
        'Confirm the deployment:',
        '',
        '```bash',
        'npm run deploy:verify',
        '```',
      ].join('\n'),
    );

    expect(manualSteps).toEqual([
      {
        command: 'npm run deploy:prepare',
        description: 'Prepare the deployment\n\nRun this before deploying:',
        section: 'before',
      },
      {
        command: 'npm run deploy:verify',
        description: 'Confirm the deployment:',
        section: 'after',
      },
    ]);
  });

  it('renders every manual step as a checkbox and groups deployment sections', () => {
    expect(
      renderManualSteps([
        {
          command: 'npm run deploy:after',
          description: 'After step',
          section: 'after',
        },
        {
          command: 'npm run deploy:before',
          description: 'Before step',
          section: 'before',
        },
      ]),
    ).toEqual([
      '#### Before Deployment',
      '',
      '- [ ] Before step',
      '   ```bash',
      '   npm run deploy:before',
      '   ```',
      '',
      '#### After Deployment',
      '',
      '- [ ] After step',
      '   ```bash',
      '   npm run deploy:after',
      '   ```',
    ]);
  });

  it('retains trailing annotations until the deployment section ends', () => {
    const annotatedSteps = extractManualSteps(
      [
        '## Manual Deployment Steps',
        '',
        '### Before Deployment',
        '',
        '#### Deploy the change',
        '',
        'Run the deployment:',
        '',
        '```bash',
        'npm run deploy',
        '```',
        '',
        'Confirm the deployment completed successfully.',
        '',
        '### After Deployment',
      ].join('\n'),
    );

    expect(annotatedSteps).toEqual([
      {
        command: 'npm run deploy',
        description:
          'Deploy the change\n\nRun the deployment:\n\nConfirm the deployment completed successfully.',
        section: 'before',
      },
    ]);

    const genericAnnotatedSteps = extractManualSteps(
      [
        '### Before Deployment',
        '',
        '```bash',
        'npm run deploy',
        '```',
        '',
        'Remember to confirm the deployment status.',
        '',
        '## Notes',
        '',
        'This note is not a deployment annotation.',
      ].join('\n'),
    );

    expect(genericAnnotatedSteps).toEqual([
      {
        command: 'npm run deploy',
        description: 'Remember to confirm the deployment status.',
        section: 'before',
      },
    ]);

    const unscopedSteps = extractManualSteps(
      [
        'Run this command:',
        '',
        '```bash',
        'npm run deploy',
        '```',
        '',
        'This is general PR text.',
      ].join('\n'),
    );

    expect(unscopedSteps).toEqual([
      {
        command: 'npm run deploy',
        description: 'Run this command:',
      },
    ]);
  });

  it('keeps annotations before a section boundary with the preceding step', () => {
    const manualSteps = extractManualSteps(
      [
        '## Manual Deployment Steps',
        '',
        '### Before Deployment',
        '',
        '#### Prepare the deployment',
        '',
        '```bash',
        'npm run deploy:prepare',
        '```',
        '',
        'Confirm the preparation completed successfully.',
        '',
        '### After Deployment',
        '',
        '#### Verify the deployment',
        '',
        'Run the verification:',
        '',
        '```bash',
        'npm run deploy:verify',
        '```',
        '',
        'Confirm the verification completed successfully.',
        '',
        '## Notes',
      ].join('\n'),
    );

    expect(manualSteps).toEqual([
      {
        command: 'npm run deploy:prepare',
        description:
          'Prepare the deployment\n\nConfirm the preparation completed successfully.',
        section: 'before',
      },
      {
        command: 'npm run deploy:verify',
        description:
          'Verify the deployment\n\nRun the verification:\n\nConfirm the verification completed successfully.',
        section: 'after',
      },
    ]);
  });

  it('does not treat heading descriptions as deployment section headings', () => {
    const manualSteps = extractManualSteps(
      [
        '## Manual Deployment Steps',
        '',
        '### Before Deployment',
        '',
        '#### After Deployment: verify aliases',
        '',
        'Run this command:',
        '',
        '```bash',
        'npm run deploy:verify',
        '```',
      ].join('\n'),
    );

    expect(manualSteps).toEqual([
      {
        command: 'npm run deploy:verify',
        description: 'After Deployment: verify aliases\n\nRun this command:',
        section: 'before',
      },
    ]);
  });
});
