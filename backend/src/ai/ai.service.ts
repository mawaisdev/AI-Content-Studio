/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

@Injectable()
export class AiService {
  private client: OpenAI;

  constructor(private config: ConfigService) {
    this.client = new OpenAI({
      apiKey: this.config.get('ai.apiKey'),
    });
  }

  async generateText(prompt: string) {
    try {
      const completion = await this.client.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: this.config.get('ai.model') || 'gpt-3.5-turbo',
        temperature: this.config.get('ai.temperature'),
      });

      return {
        content: completion.choices[0].message.content,
        tokens: completion.usage?.total_tokens,
      };
    } catch (error) {
      throw new Error(`OpenAI API Error: ${error.message}`);
    }
  }
}
