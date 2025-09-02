export interface ProductLink {
  uri: string;
  title: string;
}

export interface GroundingChunk {
  // FIX: The `web` property is optional in the GroundingChunk type from the @google/genai SDK.
  // Making it optional here resolves the type incompatibility error.
  web?: {
    uri?: string;
    title?: string;
  };
}
