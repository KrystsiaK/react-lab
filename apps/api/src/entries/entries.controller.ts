import { Body, Controller, Get, Inject, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { AuthUser } from "../common/auth-user.decorator";
import { CreateEntryDto, PublishEntryDto } from "./dto";
import { EntriesService } from "./entries.service";

@Controller("entries")
export class EntriesController {
  constructor(@Inject(EntriesService) private readonly entriesService: EntriesService) {}

  @Get("public")
  publicFeed() {
    return this.entriesService.publicFeed();
  }

  @UseGuards(JwtAuthGuard)
  @Get("me")
  myEntries(@AuthUser() user: { userId: string }) {
    return this.entriesService.myEntries(user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@AuthUser() user: { userId: string }, @Body() dto: CreateEntryDto) {
    return this.entriesService.create(user.userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(":id/visibility")
  setVisibility(
    @AuthUser() user: { userId: string },
    @Param("id") id: string,
    @Body() dto: PublishEntryDto,
  ) {
    return this.entriesService.setPublic(user.userId, id, dto.isPublic);
  }
}
