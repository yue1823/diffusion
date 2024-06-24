import React from 'react';

interface DataContextType {
    sharedData: number;
    setSharedData: React.Dispatch<React.SetStateAction<number>>;
}
export const DataContext = React.createContext<DataContextType | undefined>(undefined);
