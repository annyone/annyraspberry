import React from 'react';
import Card from './Card';
import Text from './Text';

export default function FeedbackCard({ text }) {
  return (
    <Card as="article" className="flex p-4 xl:p-6">
      <p className="text-3xl mr-4">💬</p>
      <Text variant="p">{text}</Text>
    </Card>
  );
}
