import React from 'react';
import { IconProps } from './types';

export const StopIcon: React.FC<IconProps> = ({ className = '' }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path fillRule="evenodd" d="M4.5 7.5a3 3 0 113 3v6a3 3 0 11-6 0v-6a3 3 0 013-3zm9 3a3 3 0 013 3v6a3 3 0 11-6 0v-6a3 3 0 013-3z" clipRule="evenodd" />
  </svg>
); 