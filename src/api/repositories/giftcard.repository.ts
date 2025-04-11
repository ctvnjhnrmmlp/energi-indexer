import { Request } from 'express';
import Prisma from '../database/database';

export class GiftcardRepository {
  async create(req: Request, image: string) {
    await Prisma.giftCard.create({
      data: {
        name: req.body.name,
        image: image,
        summary: req.body.summary,
        title: req.body.title,
        description: req.body.description,
        tutorial: req.body.tutorial,
        price: Number.parseInt(req.body.price),
        reward: Number.parseInt(req.body.reward),
        amounts: JSON.parse(req.body.amounts),
      },
    });
  }

  async findMany(query?: string) {
    let giftCards = null;

    if (!query) {
      giftCards = await Prisma.giftCard.findMany();
      return giftCards;
    }

    giftCards = await Prisma.giftCard.findMany({
      where: {
        OR: [
          {
            name: {
              contains: query.trim(),
              mode: 'insensitive',
            },
          },
          {
            summary: {
              contains: query.trim(),
              mode: 'insensitive',
            },
          },
          {
            title: {
              contains: query.trim(),
              mode: 'insensitive',
            },
          },
          {
            description: {
              contains: query.trim(),
              mode: 'insensitive',
            },
          },
        ],
      },
    });
    return giftCards;
  }

  async findUnique(pid: string) {
    const giftCards = await Prisma.giftCard.findUnique({
      where: {
        id: pid,
      },
    });
    return giftCards;
  }

  async findTopSellers() {
    const giftCards = await Prisma.giftCard.findMany({
      orderBy: {
        reviews: {
          _count: 'desc',
        },
      },
      take: 10,
      include: {
        reviews: true,
      },
    });
    return giftCards;
  }

  async findPopulars() {
    const giftCards = await Prisma.giftCard.findMany({
      orderBy: {
        rating: 'desc',
      },
      take: 10,
      include: {
        reviews: true,
      },
    });
    return giftCards;
  }

  async findLatests() {
    const giftCards = await Prisma.giftCard.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    return giftCards;
  }

  async update(req: Request, image: string) {
    await Prisma.giftCard.update({
      where: {
        id: req.body.pid,
      },
      data: {
        name: req.body.name,
        image: image,
        summary: req.body.summary,
        title: req.body.title,
        description: req.body.description,
        tutorial: req.body.tutorial,
        price: Number.parseInt(req.body.price),
        reward: Number.parseInt(req.body.reward),
        amounts: JSON.parse(req.body.amounts),
      },
    });
  }

  async remove(pid: string) {
    await Prisma.giftCard.delete({
      where: {
        id: pid,
      },
    });
  }
}
