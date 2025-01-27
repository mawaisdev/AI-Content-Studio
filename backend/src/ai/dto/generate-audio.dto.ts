import { IsString, IsOptional, IsIn } from "class-validator";

export class GenerateAudioDto {
      @IsString()
      audioPrompt: string;
}