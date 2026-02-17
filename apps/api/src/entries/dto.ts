import { EntryType } from "../generated/prisma/index";
import { IsBoolean, IsEnum, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class CreateEntryDto {
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  title!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(5000)
  content!: string;

  @IsEnum(EntryType)
  type!: EntryType;

  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;
}

export class PublishEntryDto {
  @IsBoolean()
  isPublic!: boolean;
}
