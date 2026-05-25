import React from 'react'
import { BuilderLayout } from '../BuilderLayout';

interface Data {
    title: string,
}

export const EditMode = (data: Data) => {
    const { title } = data;
    // console.log("EditMode loaded with title:", title);

    return (
        <div className="flex-1 h-[calc(100vh-3.5rem)]">
            <BuilderLayout />
        </div>
    );
}
