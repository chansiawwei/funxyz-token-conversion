import type { Meta, StoryObj } from '@storybook/react';
import { Skeleton, SkeletonText, SkeletonCard, SkeletonSpinner } from './Skeleton';

const meta: Meta<typeof Skeleton> = {
  title: 'Components/Skeleton',
  component: Skeleton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    width: {
      control: 'text',
      description: 'Width of the skeleton (CSS value)',
    },
    height: {
      control: 'text',
      description: 'Height of the skeleton (CSS value)',
    },
    rounded: {
      control: 'boolean',
      description: 'Whether to apply rounded corners',
    },
    animate: {
      control: 'boolean',
      description: 'Whether to show pulse animation',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    width: '200px',
    height: '20px',
    rounded: true,
    animate: true,
  },
};

export const WithoutAnimation: Story = {
  args: {
    width: '200px',
    height: '20px',
    rounded: true,
    animate: false,
  },
};

export const Rectangle: Story = {
  args: {
    width: '300px',
    height: '100px',
    rounded: false,
    animate: true,
  },
};

// Skeleton Card Story
export const Card: StoryObj<typeof SkeletonCard> = {
  render: (args) => <SkeletonCard {...args} />,
  args: {},
};

// Skeleton Spinner Stories
export const SpinnerSmall: StoryObj<typeof SkeletonSpinner> = {
  render: (args) => <SkeletonSpinner {...args} />,
  args: {
    size: 'sm',
  },
};

export const SpinnerMedium: StoryObj<typeof SkeletonSpinner> = {
  render: (args) => <SkeletonSpinner {...args} />,
  args: {
    size: 'md',
  },
};

export const SpinnerLarge: StoryObj<typeof SkeletonSpinner> = {
  render: (args) => <SkeletonSpinner {...args} />,
  args: {
    size: 'lg',
  },
};




// Combined Example
export const CombinedExample = {
  render: () => (
    <div className="space-y-4 p-4">
      <div className="flex items-center space-x-3">
        <div className="flex-1">
          <SkeletonText lines={2} />
        </div>
      </div>
      <SkeletonCard />
      <div className="flex justify-center">
        <SkeletonSpinner size="lg" />
      </div>
    </div>
  ),
};

// Dark Mode Example
export const DarkModeExample = {
  render: () => (
    <div className="dark bg-gray-800 p-4 space-y-4">
      <div className="flex items-center space-x-3">
        <div className="flex-1">
          <SkeletonText lines={2} />
        </div>
      </div>
      <SkeletonCard />
      <div className="flex justify-center">
        <SkeletonSpinner size="lg" />
      </div>
    </div>
  ),
};