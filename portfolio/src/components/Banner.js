import React from 'react';
import Text from './Text';

// Simple Banner component: emoji, title, text
export default function Banner({ emoji = 'ℹ️', title, text, className = '' }) {
  return (
    <div className={`flex gap-4 bg-zinc-50/75 p-6 rounded-xl dark:bg-zinc-800/60 ${className}`}>
      <Text variant="p">{emoji}</Text>
      <div>
        {title && <Text variant="p" className="font-semibold mb-2">{title}</Text>}
        {text && <Text variant="p" className="text-zinc-500">{text}</Text>}
      </div>
    </div>
  );
}
