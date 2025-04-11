import { CartItem } from '@prisma/client';
import { TokenPayload } from 'google-auth-library';
import Prisma from '../database/database';

export class UserRepository {
  async create(payload: TokenPayload) {
    const user = await Prisma.user.create({
      data: {
        email: payload.email as string,
        name: payload.name as string,
        image: payload.picture,
        rewards: 0,
      },
    });
    return user;
  }

  async findUnique(payload?: TokenPayload | null, uid?: string) {
    let user = null;

    if (payload) {
      return (user = await Prisma.user.findUnique({
        where: {
          email: payload.email,
        },
        include: {
          cart: true,
        },
      }));
    }

    return (user = await Prisma.user.findUnique({
      where: {
        id: uid,
      },
      include: {
        cart: true,
        orders: true,
        reviews: true,
      },
    }));
  }

  async createCart(uid: string, pid: string, quantity: number) {
    await Prisma.cartItem.create({
      data: {
        userId: uid,
        giftCardId: pid,
        quantity: quantity,
      },
    });
  }

  async findCart(uid: string) {
    const giftCards = await Prisma.cartItem.findMany({
      where: {
        userId: uid,
      },
      include: {
        giftCard: true,
      },
    });
    return giftCards;
  }

  async findCartFirst(uid: string, pid: string) {
    const giftCard = await Prisma.cartItem.findFirst({
      where: {
        userId: uid,
        giftCardId: pid,
      },
    });
    return giftCard;
  }

  async updateCart(giftCard: CartItem, quantity: number) {
    await Prisma.cartItem.update({
      where: {
        id: giftCard.id,
      },
      data: {
        quantity: giftCard.quantity + quantity,
      },
    });
  }

  async deleteCart(pid: string) {
    await Prisma.cartItem.delete({
      where: {
        id: pid,
      },
    });
  }

  async createOrder(uid: string, oid: string, giftCards: CartItem[], totalAmount: number) {
    const savedOrder = await Prisma.order.create({
      data: {
        userId: uid,
        totalAmount,
        status: 'PENDING',
        paymentStatus: 'PENDING',
        paymentId: oid,
        items: {
          create: giftCards.map((giftCard) => ({
            giftCardId: giftCard.giftCardId,
            quantity: giftCard.quantity,
            // @ts-expect-error: must be corrected properly
            price: giftCard.giftCard.price,
          })),
        },
      },
    });
    return savedOrder;
  }

  async captureOrder(oid: string) {
    await Prisma.order.update({
      where: { id: oid },
      data: {
        status: 'CONFIRMED',
        paymentStatus: 'COMPLETED',
      },
    });
  }

  async updateProfile(uid: string, name: string, image: string) {
    await Prisma.user.update({
      where: {
        id: uid,
      },
      data: {
        name: name,
        image: image,
      },
    });
  }
}
