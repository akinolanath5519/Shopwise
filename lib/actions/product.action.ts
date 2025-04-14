'use server';

import {convertToPlainObject} from '@/lib/constant/utils';
import {LATEST_PRODUCTS_LIMIT} from '@/lib/constant/index';
import { PrismaClient } from '@prisma/client';

export async function getLatestProducts() {
  const Prisma = new PrismaClient();
   
      const data = await Prisma.product.findMany({
        take: LATEST_PRODUCTS_LIMIT,
        orderBy: { createdAt: 'desc' },
      });
      return convertToPlainObject(data);
   
  }
  