import { BadRequestException } from '@nestjs/common';
import { Prisma } from 'generated/prisma';

export const erroresDB = (error, customDBMessage: string) => {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code == 'P2002') {
      throw new BadRequestException(customDBMessage);
    }
  }
};
