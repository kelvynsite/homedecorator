import React from 'react';
import { MagicWandIcon } from './icons/MagicWandIcon';

interface PromptControlsProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
  isReady: boolean;
}

export const PromptControls: React.FC<PromptControlsProps> = ({ prompt, setPrompt, onSubmit, isLoading, isReady }) => {
  return (
    <div className="flex flex-col h-full">
      <label htmlFor="prompt" className="text-lg font-semibold text-gray-700 mb-2">
        Descreva Sua Visão
      </label>
      <textarea
        id="prompt"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Ex: 'Adicione um sofá de couro moderno, um vaso de planta grande no canto e mude a cor da parede para um verde sálvia claro.'"
        className="flex-grow p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:outline-none transition-shadow duration-300 resize-none"
        rows={6}
      />
      <button
        onClick={onSubmit}
        disabled={isLoading || !isReady || !prompt}
        className="mt-4 w-full flex items-center justify-center bg-brand-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-600 transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed transform hover:scale-105 disabled:transform-none"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Decorando...
          </>
        ) : (
          <>
            <MagicWandIcon className="h-5 w-5 mr-2" />
            Decorar Meu Ambiente
          </>
        )}
      </button>
       {!isReady && <p className="text-xs text-center text-gray-500 mt-2">Por favor, envie uma imagem para começar.</p>}
    </div>
  );
};