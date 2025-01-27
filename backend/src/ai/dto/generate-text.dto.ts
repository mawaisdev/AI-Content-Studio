import { IsString, IsIn, IsOptional } from 'class-validator';

export class GenerateTextDto {
  @IsString()
  content_type: string;

  @IsString()
  keywords: string;

  @IsOptional()
  @IsIn(['formal', 'casual', 'technical'])
  tone?: string;
}
