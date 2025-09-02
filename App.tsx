import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { PromptControls } from './components/PromptControls';
import { ResultsDisplay } from './components/ResultsDisplay';
import { Loader } from './components/Loader';
import { decorateAndFindProducts } from './services/geminiService';
import type { ProductLink } from './types';
import { fileToBase64 } from './utils/fileUtils';

const App: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [aiDescription, setAiDescription] = useState<string | null>(null);
  const [productLinks, setProductLinks] = useState<ProductLink[]>([]);

  const handleImageChange = (file: File | null) => {
    if (file) {
      setImageFile(file);
      setOriginalImageUrl(URL.createObjectURL(file));
      // Clear previous results when a new image is uploaded
      setGeneratedImageUrl(null);
      setAiDescription(null);
      setProductLinks([]);
      setError(null);
    }
  };

  const handleSubmit = useCallback(async () => {
    if (!imageFile || !prompt) {
      setError('Por favor, envie uma imagem e descreva a decoração desejada.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedImageUrl(null);
    setAiDescription(null);
    setProductLinks([]);

    try {
      const imagePart = await fileToBase64(imageFile);
      const result = await decorateAndFindProducts(prompt, imagePart);

      if (result.generatedImage) {
        setGeneratedImageUrl(`data:image/png;base64,${result.generatedImage}`);
      }
      setAiDescription(result.description);
      setProductLinks(result.productLinks);

    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Ocorreu um erro desconhecido. Por favor, tente novamente.');
    } finally {
      setIsLoading(false);
    }
  }, [imageFile, prompt]);

  return (
    <div className="min-h-screen bg-brand-secondary text-brand-dark font-sans">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto bg-brand-light rounded-2xl shadow-lg p-6 md:p-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <ImageUploader onImageChange={handleImageChange} imageUrl={originalImageUrl} />
            <PromptControls
              prompt={prompt}
              setPrompt={setPrompt}
              onSubmit={handleSubmit}
              isLoading={isLoading}
              isReady={!!imageFile}
            />
          </div>

          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md mb-6" role="alert">
              <p className="font-bold">Erro</p>
              <p>{error}</p>
            </div>
          )}

          {isLoading ? (
            <Loader />
          ) : (
            (generatedImageUrl || aiDescription || productLinks.length > 0) && (
              <ResultsDisplay
                originalImageUrl={originalImageUrl}
                generatedImageUrl={generatedImageUrl}
                aiDescription={aiDescription}
                productLinks={productLinks}
              />
            )
          )}
        </div>
      </main>
    </div>
  );
};

export default App;