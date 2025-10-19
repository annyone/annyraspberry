import React from 'react';

export default function Button({children, onClick, to, className=''}){
  const base = 'px-3 py-2 rounded-md font-medium inline-block';
  const primary = 'bg-indigo-600 text-white hover:bg-indigo-700';
  const classes = `${base} ${primary} ${className}`.trim();
  if(to){
    return <a href={to} className={classes}>{children}</a>
  }
  return <button className={classes} onClick={onClick}>{children}</button>
}
