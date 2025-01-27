import { Body, Controller, Post, Res } from '@nestjs/common';
import { GenerateTextDto } from './dto/generate-text.dto';
import { AiService } from './ai.service';
import { seconds, Throttle } from '@nestjs/throttler';
import { Public } from '../common/decorators/public.decorator';
import { GenerateImageDto } from './dto/generate-image.dto';
import { Response } from 'express';
import { GenerateAudioDto } from './dto/generate-audio.dto';


@Controller('ai')
@Public()
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Throttle({default: {ttl: seconds(10), limit: 2}})
  @Post('generate-text')
  async generateText(@Body() dto: GenerateTextDto) {
    const prompt = this.buildPrompt(dto);
    return this.aiService.generateText(prompt);
  }

  @Throttle({ default: { ttl: seconds(10), limit: 3 } })
  @Post('generate-image')
  async generateImage(@Body() dto: GenerateImageDto, @Res() res: Response) {
    const image = await this.aiService.generateImage(dto.imagePrompt);
  
    // Set the appropriate Content-Type header for the image
    res.setHeader('Content-Type', 'image/png'); // Adjust based on the image format
    res.setHeader('Content-Disposition', 'attachment; filename="generated-image.png"');
    res.send(image);
  }


  @Throttle({ default: { ttl: seconds(10), limit: 3 }})
  @Post('generate-audio')
  async generateAudio(@Body() dto: GenerateAudioDto, @Res() res: Response) {
    const audio = await this.aiService.generateAudio(dto.audioPrompt);
    res.setHeader('Content-Type', 'audio/wav'); // Adjust based on the image format
    res.setHeader('Content-Disposition', 'attachment; filename="generated-audio.wav"');
    res.send(audio);
  }

  private buildPrompt(dto: GenerateTextDto): string {
    return `Generate ${dto.content_type} content focusing on: ${dto.keywords}.
            Tone: ${dto.tone || 'neutral'}.
            Include relevant examples and practical advice.
            The end result should be in the form of a valid json where add two things. first
            generated_content while the other should be a summary of the generated content with
            the limit of maximum 40 characters. This summary will be used to generate the image 
            related to article.
            Expected JSON format: { generatedContent: {{TEXT_DESCRIPTION}}, imageGenerationPrompt: {{IMAGE_GENERATION_PROMPT}}}
            `;
  }
}
