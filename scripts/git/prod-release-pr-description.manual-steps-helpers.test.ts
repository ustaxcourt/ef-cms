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
});
