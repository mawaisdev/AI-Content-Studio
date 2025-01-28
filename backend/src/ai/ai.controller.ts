import { Body, Controller, Post, Res } from '@nestjs/common';
import { GenerateTextDto } from './dto/generate-text.dto';
import { AiService } from './ai.service';
import { seconds, Throttle } from '@nestjs/throttler';
import { GenerateImageDto } from './dto/generate-image.dto';
import { Response } from 'express';
import { GenerateAudioDto } from './dto/generate-audio.dto';

@Controller('ai')
@Throttle({default: {ttl: seconds(10), limit: 2}})
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('generate-text')
  async generateText(@Body() dto: GenerateTextDto) {
    const prompt = this.buildPrompt(dto);
    return this.aiService.generateText(prompt);
  }

  @Post('generate-image')
  async generateImage(@Body() dto: GenerateImageDto, @Res() res: Response) {
    const image = await this.aiService.generateImage(dto.imagePrompt);
  
    // Set the appropriate Content-Type header for the image
    res.setHeader('Content-Type', 'image/png'); // Adjust based on the image format
    res.setHeader('Content-Disposition', 'attachment; filename="generated-image.png"');
    res.send(image);
  }


  @Post('generate-audio')
  async generateAudio(@Body() dto: GenerateAudioDto, @Res() res: Response) {
    const audio = await this.aiService.generateAudio(dto.audioPrompt);
    res.setHeader('Content-Type', 'audio/wav'); // Adjust based on the image format
    res.setHeader('Content-Disposition', 'attachment; filename="generated-audio.wav"');
    res.send(audio);
  }



  private buildPrompt(dto: GenerateTextDto): string {
    return `Generate ${dto.content_type} content following these requirements:
  
  1. Content Requirements:
    - Primary keywords: ${dto.keywords}
    - Tone: ${dto.tone || 'neutral'}
    - Include: 1 practical example, 3 key takeaways
    - Length: ${dto.wordLimit ? `${dto.wordLimit} words` : 'concise'}
    - Paragraphs: Minimum 3
  
  2. Image Prompt Requirements:
    - Style: Photorealistic/Illustrative (choose based on content)
    - Key elements: 2-3 visual metaphors from article
    - Composition: Describe scene layout
    - Color palette: Suggest mood-appropriate colors
  
  3. Audience Analysis:
    - Primary demographic: Age range + key interest
    - Secondary targets: Optional complementary groups
    - Content suitability: Platform suggestions (e.g., LinkedIn, TikTok)
  
  CRITICAL JSON FORMATTING RULES:
  1. Use simple formatting:
     - Avoid using quotation marks within text
     - Use parentheses or dashes instead of quotes for emphasis
     - Replace terms in quotes with italics indicators (use *term* instead of "term")
     - Use plain numbered lists instead of quotation marks for steps or sequences
  
  2. Content structure:
     - Use periods for sentence endings, not quotation marks
     - Use colons instead of quotes for introducing concepts
     - Use dashes for dialogue or spoken content
     - Separate sections with clear headers using asterisks
  
  3. Return ONLY a valid JSON object with this EXACT structure:
  {
    "generatedContent": "Your content here. Use *term* for emphasis. Avoid quotes entirely.",
    "imageGenerationPrompt": "Visual description here. Use *term* for emphasis. Avoid quotes entirely.",
    "suggestedAudience": {
      "primary": "demographic description",
      "platforms": ["platform1", "platform2"]
    }
  }
  
  Example format for emphasizing terms:
  INCORRECT: This is a "special" feature
  CORRECT: This is a *special* feature
  
  Example format for steps:
  INCORRECT: Step "one" involves...
  CORRECT: Step 1 involves...
  
  Example format for concepts:
  INCORRECT: The "Technical Triangle" consists of...
  CORRECT: The Technical Triangle consists of...
  
  Remember:
  - No nested quotes anywhere in the content
  - No special characters except periods, commas, and asterisks
  - Use numbers instead of quoted text for sequences
  - Use asterisks (*) for emphasis instead of quotes
  - Keep JSON structure exact but simplify content formatting`;
  }
}
