import React from 'react';
import { Listbox } from '@headlessui/react';
import { CheckIcon } from '@heroicons/react/20/solid';
import { SkeletonText } from './Skeleton';
import { Token } from '../types';

interface TokenItemProps {
  index: number;
  style: React.CSSProperties;
  data: {
    tokens: Token[];
    selectedToken: Token | null;
    onSelect: (token: Token) => void;
  };
}

export const TokenItem = React.memo(({ index, style, data }: TokenItemProps) => {
  const { tokens, selectedToken, onSelect } = data;
  const token = tokens[index];

  if (!token) {
    return (
      <div style={style} className="px-4 py-2">
        <SkeletonText lines={2} />
      </div>
    );
  }

  const isSelected = selectedToken?.address === token.address && 
                   selectedToken?.chainId === token.chainId;

  return (
    <Listbox.Option
      key={`${token.address}-${token.chainId}`}
      value={token}
      style={style}
      className={({ active }) =>
        `relative cursor-default select-none py-2 pl-10 pr-4 ${
          active ? 'bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100' : 'text-gray-900 dark:text-white'
        }`
      }
      onClick={() => onSelect(token)}
    >
      {({ selected, active }) => (
        <>
          <div className="flex items-center">
            {token.logoURI && (
              <img
                src={token.logoURI}
                alt={token.symbol}
                className="h-6 w-6 rounded-full mr-3"
              />
            )}
            <div className="flex flex-col">
              <span className={`block truncate ${
                selected ? 'font-medium' : 'font-normal'
              }`}>
                {token.symbol}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {token.name} • {token.chainName}
              </span>
            </div>
          </div>
          {(selected || isSelected) && (
            <span className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
              active ? 'text-blue-600 dark:text-blue-400' : 'text-blue-600 dark:text-blue-400'
            }`}>
              <CheckIcon className="h-5 w-5" aria-hidden="true" />
            </span>
          )}
        </>
      )}
    </Listbox.Option>
  );
});

TokenItem.displayName = 'TokenItem';