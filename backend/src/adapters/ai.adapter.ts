/**
 * AI adapter interface for AI provider abstraction
 * Allows swapping between OpenAI, Anthropic, local models, etc.
 */

export interface AIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface AIGenerateOptions {
  messages: AIMessage[];
  model?: string;
  temperature?: number;
  maxTokens?: number;
  metadata?: Record<string, any>;
}

export interface AIGenerateResponse {
  content: string;
  model: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export interface IAIAdapter {
  generate(options: AIGenerateOptions): Promise<AIGenerateResponse>;
  getSupportedModels(): string[];
}

/**
 * OpenAI adapter implementation (wraps the existing OpenAIService)
 */
export class OpenAIAdapter implements IAIAdapter {
  constructor(private apiKey: string) {}

  async generate(options: AIGenerateOptions): Promise<AIGenerateResponse> {
    // This would use the actual OpenAI SDK
    // For now, return a mock response
    return {
      content: 'AI-generated response would appear here',
      model: options.model || 'gpt-4-turbo-preview',
      usage: {
        promptTokens: 100,
        completionTokens: 50,
        totalTokens: 150,
      },
    };
  }

  getSupportedModels(): string[] {
    return ['gpt-4-turbo-preview', 'gpt-4', 'gpt-3.5-turbo'];
  }
}

/**
 * Anthropic adapter (stub)
 */
export class AnthropicAdapter implements IAIAdapter {
  constructor(private apiKey: string) {}

  async generate(options: AIGenerateOptions): Promise<AIGenerateResponse> {
    return {
      content: 'Anthropic AI response would appear here',
      model: options.model || 'claude-3-opus-20240229',
      usage: {
        promptTokens: 100,
        completionTokens: 50,
        totalTokens: 150,
      },
    };
  }

  getSupportedModels(): string[] {
    return ['claude-3-opus-20240229', 'claude-3-sonnet-20240229'];
  }
}

/**
 * Local model adapter (stub)
 */
export class LocalModelAdapter implements IAIAdapter {
  async generate(options: AIGenerateOptions): Promise<AIGenerateResponse> {
    return {
      content: 'Local model response would appear here',
      model: 'local-llama-2',
      usage: {
        promptTokens: 100,
        completionTokens: 50,
        totalTokens: 150,
      },
    };
  }

  getSupportedModels(): string[] {
    return ['local-llama-2', 'local-mistral'];
  }
}
