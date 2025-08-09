import type { Meta, StoryObj } from '@storybook/react';
import { Skeleton, SkeletonText, SkeletonCard, SkeletonSpinner, SkeletonButton, SkeletonAvatar } from './Skeleton';

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


// Skeleton Avatar Stories
export const AvatarSmall: StoryObj<typeof SkeletonAvatar> = {
  render: (args) => <SkeletonAvatar {...args} />,
  args: {
    size: 32,
  },
};

export const AvatarMedium: StoryObj<typeof SkeletonAvatar> = {
  render: (args) => <SkeletonAvatar {...args} />,
  args: {
    size: 48,
  },
};

export const AvatarLarge: StoryObj<typeof SkeletonAvatar> = {
  render: (args) => <SkeletonAvatar {...args} />,
  args: {
    size: 64,
  },
};

// Combined Example
export const CombinedExample: Story = {
  render: () => (
    <div className="space-y-4 w-80">
      <div className="flex items-center space-x-3">
        <SkeletonAvatar size={40} />
        <div className="flex-1">
          <SkeletonText lines={2} />
        </div>
      </div>
      <SkeletonCard />
      <div className="flex justify-center">
        <SkeletonSpinner size="lg" />
      </div>
      <SkeletonButton />
    </div>
  ),
};

// Dark Mode Example
export const DarkMode: Story = {
  render: () => (
    <div className="dark bg-gray-900 p-6 space-y-4 w-80">
      <div className="flex items-center space-x-3">
        <SkeletonAvatar size={40} />
        <div className="flex-1">
          <SkeletonText lines={2} />
        </div>
      </div>
      <SkeletonCard />
      <div className="flex justify-center">
        <SkeletonSpinner size="lg" />
      </div>
      <SkeletonButton />
    </div>
  ),
};