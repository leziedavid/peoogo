'use client';

import React from 'react';

interface VideoProps {
    src?: string; // rend src optionnel
    className?: string;
}

const Video: React.FC<VideoProps> = ({ src, className }) => {
    return (
        <video
            src={src}
            className={className}
            controls
            preload="metadata"
            style={{ borderRadius: '0.5rem', border: '1px solid #e5e7eb' }} // arrondi + bordure
        />
    );
};

export default Video;
