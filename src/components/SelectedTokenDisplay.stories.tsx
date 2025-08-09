import type { Meta, StoryObj } from '@storybook/react';
import { SelectedTokenDisplay } from './SelectedTokenDisplay';
import { Token } from '../types';

const meta: Meta<typeof SelectedTokenDisplay> = {
  title: 'Components/SelectedTokenDisplay',
  component: SelectedTokenDisplay,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Mock token data
const mockToken: Token = {
  address: '0xA0b86a33E6441c8C06DD2b7c94b7E0e8c0c8c8c8',
  symbol: 'USDT',
  name: 'Tether USD',
  decimals: 6,
  chainId: '1',
  chainName: 'Ethereum',
  logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png',
};

const mockTokenWithoutLogo: Token = {
  address: '0xB0b86a33E6441c8C06DD2b7c94b7E0e8c0c8c8c8',
  symbol: 'CUSTOM',
  name: 'Custom Token',
  decimals: 18,
  chainId: '137',
  chainName: 'Polygon',
  logoURI: undefined,
};

const mockTokenLongAddress: Token = {
  address: '0x1234567890123456789012345678901234567890123456789012345678901234',
  symbol: 'LONG',
  name: 'Token with Very Long Name That Should Wrap Properly',
  decimals: 18,
  chainId: '56',
  chainName: 'BSC',
  logoURI: 'https://via.placeholder.com/48x48/FF6B35/FFFFFF?text=L',
};

export const Default: Story = {
  args: {
    selectedToken: mockToken,
    title: 'Selected Token',
  },
};

export const DarkMode: Story = {
  args: {
    selectedToken: mockToken,
    title: 'Selected Token',
  },
  parameters: {
    backgrounds: {
      default: 'dark',
    },
  },
  decorators: [
    (Story) => (
      <div className="dark">
        <Story />
      </div>
    ),
  ],
};