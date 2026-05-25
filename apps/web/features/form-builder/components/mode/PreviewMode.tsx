import React from 'react';
import { FormRenderer } from '../canvas/FormRenderer';

export const PreviewMode = () => {
    return (
        <div className="flex h-full w-full bg-background overflow-hidden justify-center overflow-y-auto custom-scrollbar">
            <div className="w-full">
                <FormRenderer isLive={true} />
            </div>
        </div>
    );
}
