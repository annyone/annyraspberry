import React from 'react';

const Image = ({ 
  src, 
  sources = [], // массив объектов { srcSet, media, type }
  backgroundColor, 
  alt = '', 
  className = '', 
  shadow = false 
}) => {
  // Определяем, является ли background градиентом или картинкой
  const isGradientOrImage = backgroundColor?.includes('gradient') || backgroundColor?.startsWith('url(');

  const backgroundStyle = backgroundColor 
    ? (isGradientOrImage
        ? { backgroundImage: backgroundColor }
        : { backgroundColor })
    : null;

  const shadowStyle = { boxShadow: '0 0 8px rgba(0, 0, 0, 0.1)' };

  const imageStyle = {
    width: '100%',
    maxWidth: 'none',
    height: 'auto',
    display: 'block',
    ...(shadow && shadowStyle)
  };

  const imageContent = sources.length > 0 ? (
    <picture style={{ width: '100%', display: 'block' }}>
      {sources.map((source, index) => (
        <source 
          key={index} 
          srcSet={source.srcSet} 
          media={source.media} 
          type={source.type}
        />
      ))}
      <img 
        src={src} 
        alt={alt} 
        className="rounded-lg"
        style={imageStyle}
      />
    </picture>
  ) : (
    <img 
      src={src} 
      alt={alt} 
      className="rounded-lg"
      style={imageStyle}
    />
  );

  if (backgroundColor) {
    return (
      <div className={`rounded-lg p-2 lg:p-6 xl:p-8 ${className || 'w-full'}`} style={backgroundStyle}>
        {imageContent}
      </div>
    );
  } else {
    return (
      <div className={`${className || 'w-full h-full'}`}>
        {imageContent}
      </div>
    );
  }
};

export default Image;
