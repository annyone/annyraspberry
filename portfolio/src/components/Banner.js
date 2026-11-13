import React from 'react';
import Card from './Card';
import Text from './Text';

export default function Banner({ emoji = 'ℹ️', title, text, className = '' }) {
  return (
    <Card className={`flex gap-4 p-6 ${className}`}>
      <Text variant="p">{emoji}</Text>
      <div>
        {title && (
          <Text variant="p" className="font-semibold mb-2">
            {title}
          </Text>
        )}
        {text && (
          <Text variant="p" className="text-zinc-500">
            {text}
          </Text>
        )}
      </div>
    </Card>
  );
}
