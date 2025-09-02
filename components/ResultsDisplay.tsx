import React from 'react';
import type { ProductLink } from '../types';
import { LinkIcon } from './icons/LinkIcon';

interface ResultsDisplayProps {
  originalImageUrl: string | null;
  generatedImageUrl: string | null;
  aiDescription: string | null;
  productLinks: ProductLink[];
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({
  originalImageUrl,
  generatedImageUrl,
  aiDescription,
  productLinks,
}) => {
  return (
    <div className="mt-8 pt-6 border-t border-gray-200">
      <h2 className="text-2xl font-bold text-center mb-6 text-brand-dark">Seu Novo Visual</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <h3 className="text-lg font-semibold text-center mb-2">Antes</h3>
          {originalImageUrl && (
            <img src={originalImageUrl} alt="Ambiente original" className="w-full rounded-lg shadow-md" />
          )}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-center mb-2">Depois</h3>
          {generatedImageUrl ? (
            <img src={generatedImageUrl} alt="Ambiente decorado" className="w-full rounded-lg shadow-md" />
          ) : (
            <div className="w-full aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">Imagem não disponível</p>
            </div>
          )}
        </div>
      </div>

      {(aiDescription || productLinks.length > 0) && (
        <div className="bg-brand-secondary p-6 rounded-lg">
          {aiDescription && (
             <div>
               <h3 className="text-xl font-semibold mb-2 text-brand-primary">Sugestões da IA</h3>
               <p className="text-gray-700 whitespace-pre-wrap">{aiDescription}</p>
             </div>
           )}

          {productLinks.length > 0 && (
            <div className={aiDescription ? 'mt-6' : ''}>
              <h3 className="text-xl font-semibold mb-3 text-brand-primary">Compre o Visual</h3>
              <ul className="space-y-2">
                {productLinks.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-gray-800 hover:text-brand-primary font-medium group transition-colors"
                    >
                      <LinkIcon className="h-4 w-4 mr-2 text-gray-500 group-hover:text-brand-primary" />
                      {link.title || 'Ver Produto'}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};