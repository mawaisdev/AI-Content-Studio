import { IsString, IsIn, IsOptional, IsNumber,  } from 'class-validator';

export class GenerateTextDto {
  @IsString()
  content_type: string;

  @IsString()
  keywords: string;

  @IsOptional()
  @IsIn(['formal', 'casual', 'technical'])
  tone?: string;

  @IsNumber({allowInfinity: false, allowNaN: false})
  wordLimit?: number = 600;
}
