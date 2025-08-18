import type { Meta, StoryObj } from '@storybook/react-vite';
import { Icon } from '../components/Icon';
import { faLock, faWrench, faCopy } from '@fortawesome/free-solid-svg-icons';

const meta: Meta<typeof Icon> = {
  title: 'Dawson UI/Icon',
  component: Icon,
  parameters: {
    icon: faLock,
    'aria-label': 'Icon text',
  },
  tags: ['autodocs'],
  argTypes: {
    icon: {
      control: 'select',
      options: [faLock, faWrench, faCopy],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const sealed: Story = {
  args: {
    icon: faLock,
    size: '1x',
    'aria-label': 'sealed',
    className: 'iconSealed',
  },
};

export const maintenance: Story = {
  args: {
    icon: faWrench,
    size: '4x',
    className: 'wrench-icon text-center',
  },
};

export const consolidatedCase: Story = {
  args: {
    icon: faCopy,
    size: '1x',
    'aria-label': 'consolidated case',
    className: 'icon-consolidated',
  },
};
