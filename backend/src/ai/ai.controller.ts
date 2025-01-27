import { Body, Controller, Post } from '@nestjs/common';
import { GenerateTextDto } from './dto/generate-text.dto';
import { AiService } from './ai.service';

@Controller('ai')
export class AiController {
  constructor(private readonly openaiService: AiService) {}

  @Post('generate-text')
  async generateText(@Body() dto: GenerateTextDto) {
    const prompt = this.buildPrompt(dto);
    return this.openaiService.generateText(prompt);
  }

  private buildPrompt(dto: GenerateTextDto): string {
    return `Generate ${dto.content_type} content focusing on: ${dto.keywords}.
            Tone: ${dto.tone || 'neutral'}.
            Include relevant examples and practical advice.`;
  }
}
