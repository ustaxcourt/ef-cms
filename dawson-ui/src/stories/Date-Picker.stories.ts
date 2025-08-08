import type { Meta, StoryObj } from '@storybook/react-vite';
import { Calendar28 } from '../components/dawson-date-picker/datepicker';

const meta = {
  title: 'Dawson UI/Date Picker',
  component: Calendar28,
  parameters: {},
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<typeof Calendar28>;

export default meta;
type Story = StoryObj<typeof meta>;

export const datePicker: Story = {
  args: {},
};
