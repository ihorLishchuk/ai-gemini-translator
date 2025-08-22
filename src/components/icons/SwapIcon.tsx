import React from 'react';
import { IconProps } from './types';

export const SwapIcon: React.FC<IconProps> = ({ className = '' }) => (
  <svg className={className + ' mt-2'} fill="currentColor" viewBox="0 0 24 24">
    <path fillRule="evenodd" d="M15.97 2.47a.75.75 0 011.06 0l4.5 4.5a.75.75 0 010 1.06l-4.5 4.5a.75.75 0 11-1.06-1.06l3.22-3.22H7.5a.75.75 0 010-1.5h11.69l-3.22-3.22a.75.75 0 010-1.06zm-7.94 0a.75.75 0 010 1.06L4.81 6.75H16.5a.75.75 0 010 1.5H4.81l3.22 3.22a.75.75 0 11-1.06 1.06l-4.5-4.5a.75.75 0 010-1.06l4.5-4.5a.75.75 0 011.06 0z" clipRule="evenodd" />
  </svg>
);
