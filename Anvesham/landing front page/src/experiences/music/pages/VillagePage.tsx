import React from 'react';
import { MusicalVillage3D } from '../components/village3d/MusicalVillage3D.tsx';

export const VillagePage: React.FC = () => {
  return (
    <div className="w-full flex flex-col">
      <MusicalVillage3D />
    </div>
  );
};
