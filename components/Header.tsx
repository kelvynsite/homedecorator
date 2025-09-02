import React from 'react';
import { PaintBrushIcon } from './icons/PaintBrushIcon';

export const Header: React.FC = () => {
  return (
    <header className="bg-brand-light shadow-md">
      <div className="container mx-auto px-4 py-4 flex items-center justify-center">
        <PaintBrushIcon className="h-8 w-8 text-brand-primary mr-3" />
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-brand-dark">Decorador de Interiores IA</h1>
          <p className="text-sm text-gray-500">Visualize o espaço dos seus sonhos instantaneamente</p>
        </div>
      </div>
    </header>
  );
};