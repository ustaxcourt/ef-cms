import type { Meta, StoryObj } from '@storybook/react-vite';
import { Icon } from '../components/Icon';

const meta = {
  title: 'Dawson UI/Icon',
  component: Icon,
  parameters: {
    icon: 'lock',
    'aria-label': 'Icon text',
  },
  tags: ['autodocs'],
  argTypes: {
    icon: {
      control: 'select',
      options: ['lock', 'wrench', 'copy'],
    },
  },
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const sealed: Story = {
  args: {
    icon: 'lock',
    size: '1x',
    'aria-label': 'sealed',
    className: 'iconSealed',
  },
};

export const maintenance: Story = {
  args: {
    icon: 'wrench',
    size: '4x',
    className: 'wrench-icon text-center',
  },
};

export const consolidatedCase: Story = {
  args: {
    icon: 'copy',
    size: '1x',
    'aria-label': 'consolidated case',
    className: 'icon-consolidated',
  },
};
