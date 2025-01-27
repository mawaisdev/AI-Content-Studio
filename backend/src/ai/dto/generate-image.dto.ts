import { IsString, IsOptional, IsIn } from "class-validator";

export class GenerateImageDto {
      @IsString()
      imagePrompt: string;
}