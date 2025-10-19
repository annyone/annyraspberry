import React from 'react';

export default function Subtitle({ children }) {
  return (
    <div className={`text-base mb-12 text-zinc-500 font-feature-settings-smcp`}>
      {children}
    </div>
  );
}
