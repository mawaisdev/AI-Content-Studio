/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {CohereClientV2} from 'cohere-ai';
import { HfInference } from "@huggingface/inference";

@Injectable()
export class AiService {
  private client: HfInference;
  private cohere: CohereClientV2;


  constructor(private config: ConfigService) {
    this.client= new  HfInference(process.env.HUGGINGFACE_API_KEY)
    this.cohere = new CohereClientV2({
      token: process.env.COHERE_API_KEY,
    })
  }

  async generateText(prompt: string, options: {} = {}) {
    try {
      // const completion = await this.client.chat.completions.create({
      //   messages: [{ role: 'user', content: prompt }],
      //   model: this.config.get('ai.model') || 'gpt-3.5-turbo',
      //   temperature: this.config.get('ai.temperature'),
      // });

      // return {
      //   content: completion.choices[0].message.content,
      //   tokens: completion.usage?.total_tokens,
      // };

      const response = await this.cohere.generate({
        model: 'command',
        prompt,
        maxTokens: 600,
        temperature: 0.7,
        k: 0,
        stopSequences: [],
        returnLikelihoods: 'NONE',
        ...options,
      });

      const generatedContent: {generatedContent: string, imageGenerationPrompt: string} = JSON.parse(response.generations[0].text)


      return {
        content: generatedContent.generatedContent,
        imageGenerationPrompt: generatedContent.imageGenerationPrompt,
        tokens: response.meta?.billedUnits?.outputTokens,
      }
    } catch (error) {
      throw new Error(`OpenAI API Error: ${error.message}`);
    }
  }

  async generateImage(prompt: string) {
    try {
      return await this.client.textToImage({
        model: "black-forest-labs/FLUX.1-dev",
        inputs: prompt,
        parameters: { num_inference_steps: 5 },
        provider: "hf-inference",
      });
    } catch (error) {
      throw new Error('Error Occurred while Generating Image')
    }
  }

  async generateAudio(prompt: string) {
    try {
      const response = await fetch("https://api-inference.huggingface.co/models/suno/bark", {
        headers: {
          "Authorization": `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          "Content-Type": "application/json"
        }, 
        method: "POST",
        body: JSON.stringify(prompt)
      })

      const result = await response.blob()
      return result
    } catch (error) {
      throw new Error("Error occurred while generating audio")
    }
  }
}
