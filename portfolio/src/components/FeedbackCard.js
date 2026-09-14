import React from 'react';
import Text from './Text';

export default function FeedbackCard({ text }) {
  return (
    <article className="flex bg-zinc-50/75 p-4 xl:p-6 rounded-xl dark:bg-zinc-800/60">
      <p className="text-3xl mr-4">💬</p>
      <Text variant="p">{text}</Text>
    </article>
  );
}
