import { ForbiddenException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateEntryDto } from "./dto";

@Injectable()
export class EntriesService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  create(userId: string, dto: CreateEntryDto) {
    return this.prisma.entry.create({
      data: {
        authorId: userId,
        title: dto.title,
        content: dto.content,
        type: dto.type,
        isPublic: dto.isPublic ?? false,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  myEntries(userId: string) {
    return this.prisma.entry.findMany({
      where: { authorId: userId },
      include: {
        author: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  publicFeed() {
    return this.prisma.entry.findMany({
      where: { isPublic: true },
      include: {
        author: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 100,
    });
  }

  async setPublic(userId: string, entryId: string, isPublic: boolean) {
    const entry = await this.prisma.entry.findUnique({ where: { id: entryId } });
    if (!entry) {
      throw new NotFoundException("Entry not found");
    }
    if (entry.authorId !== userId) {
      throw new ForbiddenException("You can only update your own entries");
    }

    return this.prisma.entry.update({
      where: { id: entryId },
      data: { isPublic },
      include: {
        author: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }
}
