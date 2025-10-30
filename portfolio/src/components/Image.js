import React from 'react';

const Image = ({ src, backgroundColor, alt = '', className = '' }) => {
  

  if (backgroundColor) {
    // Определяем, является ли background градиентом или картинкой
    const isGradientOrImage = backgroundColor?.includes('gradient') || backgroundColor?.startsWith('url(');

    const backgroundStyle = isGradientOrImage
      ? { backgroundImage: backgroundColor }
      : { backgroundColor };


    return (
      <div className={`rounded-lg p-2 lg:p-6 xl:p-10 ${className || 'w-full'}`} style={backgroundStyle}>
        <img src={src} alt={alt} className="rounded-lg w-full h-full" />
      </div>
    );
  } else {
    return (
      <img src={src} alt={alt} className={`rounded-lg ${className || 'w-full h-full'}`} />
    );
  }

};

export default Image;
