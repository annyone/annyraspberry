import React, { useState } from 'react';

const Image = ({ 
  src, 
  sources = [], // массив объектов { srcSet, media, type }
  backgroundColor, 
  alt = '', 
  className = '', 
  shadow = false 
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);

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
    opacity: isLoaded ? 1 : 0,
    transition: 'opacity 0.5s ease-in-out',
    ...(shadow && shadowStyle)
  };

  const handleImageLoad = () => {
    setIsLoaded(true);
  };

  const handleImageError = () => {
    setIsError(true);
    setIsLoaded(true);
  };


  // Стиль для скелетона загрузки
  const skeletonStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    opacity: isLoaded ? 0 : 1,
    transition: 'opacity 0.5s ease-in-out',
    pointerEvents: 'none'
  };

  const imageContent = sources.length > 0 ? (
    <picture style={{ width: '100%', display: 'block', position: 'relative' }}>
      <div style={skeletonStyle} className="rounded-lg bg-zinc-200 dark:bg-zinc-700" />
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
        onLoad={handleImageLoad}
        onError={handleImageError}
      />
    </picture>
  ) : (
    <div style={{ position: 'relative', width: '100%', display: 'block' }}>
      <div style={skeletonStyle} className="rounded-lg bg-zinc-200 dark:bg-zinc-700" />
      <img 
        src={src} 
        alt={alt} 
        className="rounded-lg"
        style={imageStyle}
        onLoad={handleImageLoad}
        onError={handleImageError}
      />
    </div>
  );

  // Стиль для контейнера с фоном - тоже делаем его плавно появляющимся
  const containerStyle = backgroundColor ? {
    ...backgroundStyle,
    opacity: isLoaded ? 1 : 0,
    transition: 'opacity 0.5s ease-in-out'
  } : null;

  if (backgroundColor) {
    return (
      <div className={`rounded-lg p-2 lg:p-6 xl:p-8 ${className || 'w-full'}`} style={containerStyle}>
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
