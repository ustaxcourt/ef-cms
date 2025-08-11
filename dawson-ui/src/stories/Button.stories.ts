import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../components/dawson-button/Button';

const meta = {
  title: 'Dawson UI/Button',
  component: Button,
  parameters: {
    children: 'Primary',
  },
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const primary: Story = {
  args: {
    children: 'Primary',
  },
};

export const secondary: Story = {
  args: {},
};

export const destructive: Story = {
  args: {},
};

export const tertiary: Story = {
  args: {},
};

export const tertiaryDestructive: Story = {
  args: {},
};
