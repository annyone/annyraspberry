import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

// Tailwind utility classes for nav link
const baseStyles = 'text-zinc-500 transition-transform duration-150';
const hoverStyles = 'hover:-translate-y-0.5 hover:text-rose-500';
const focusStyles = 'focus:-translate-y-0.5 focus:text-rose-500';

// icon: React element, text: string (optional), href: string (required for external), to: string (for internal)
const iconClass = 'h-7 w-7';

export default function Link({ to, href, text, icon, children, className = '', showLinkIcon = false, preserveIconColor = false, ...props }) {
  const baseClasses = preserveIconColor ? 'transition-transform duration-150' : baseStyles;
  const hoverClasses = preserveIconColor ? 'hover:-translate-y-0.5' : hoverStyles;
  const focusClasses = preserveIconColor ? 'focus:-translate-y-0.5' : focusStyles;
  const classes = `${baseClasses} ${hoverClasses} ${focusClasses} ${className}`.trim();
  // If icon only (no text/children), center icon; icon always gets same size
  const iconEl = icon ? React.cloneElement(icon, { 
    className: `${iconClass} ${icon.props.className || ''}`.trim() 
  }) : null;
  const content = <>
    {iconEl && <span className={text || children ? 'mr-2 inline-flex' : 'inline-flex'}>{iconEl}</span>}
    {text}
    {children}
    {showLinkIcon && <span className="ml-2">👀</span>}
  </>;

  const handleClick = (e) => {
    if ((to || href)?.startsWith('#')) {
      e.preventDefault();
      const targetId = (to || href).slice(1);
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  if (to) {
    return (
      <RouterLink to={to} className={classes} onClick={handleClick} {...props}>
        {content}
      </RouterLink>
    );
  }
  return (
    <a href={href} className={classes} onClick={handleClick} {...props}>
      {content}
    </a>
  );
}
