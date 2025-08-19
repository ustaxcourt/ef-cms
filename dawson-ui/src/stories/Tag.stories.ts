import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tag } from '../components/dawson-tag/Tag';

const meta = {
  title: 'Dawson UI/Tag',
  component: Tag,
  parameters: {},
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<typeof Tag>;

export default meta;
type Story = StoryObj<typeof meta>;

export const tagstory: Story = {
  args: {
    children: 'Hello world :)',
  },
};
