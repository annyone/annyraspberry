import React from 'react';

export default function MarkerList({ marker = '•', items = [], className = '' }) {
  return (
    <ul className={className}>
      {items.map((item, idx) => (
        <li key={idx} className="flex items-start gap-2">
          <span>{marker}</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
