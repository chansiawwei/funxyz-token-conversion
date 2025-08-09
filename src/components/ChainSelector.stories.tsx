import type { Meta, StoryObj } from '@storybook/react';
import { ChainSelector } from './ChainSelector';
import { Chain, SUPPORTED_CHAINS } from '../types';
import React, { useState } from 'react';

// Interactive wrapper for stories that need state
const InteractiveWrapper = ({ 
  className = ''
}: { 
  className?: string;
}) => {
  const [selectedChain, setSelectedChain] = useState<Chain | null>(SUPPORTED_CHAINS[0] || null);
  
  return (
    <div className="w-80 p-4">
      <ChainSelector
        selectedChain={selectedChain}
        onChainSelect={setSelectedChain}
        className={className}
      />
    </div>
  );
};

const meta: Meta<typeof ChainSelector> = {
  title: 'Components/ChainSelector',
  component: ChainSelector,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A dropdown selector for blockchain networks with chain logos and names.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    selectedChain: {
      description: 'Currently selected blockchain chain',
    },
    onChainSelect: {
      description: 'Callback when a chain is selected',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <InteractiveWrapper />,
};



export const NoSelection: Story = {
  render: () => {
    const [selectedChain, setSelectedChain] = useState<Chain | null>(null);
    
    return (
      <div className="w-80 p-4">
        <ChainSelector
          selectedChain={selectedChain}
          onChainSelect={setSelectedChain}
        />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Chain selector with no initial selection.',
      },
    },
  },
};

export const DarkMode: Story = {
  render: () => (
    <div className="dark bg-gray-900 p-6">
      <InteractiveWrapper />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Shows the component in dark mode.',
      },
    },
  },
};