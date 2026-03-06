import 'server-only';

import { prisma } from '@/lib/prisma';

type AccountShellData = {
  favoritesCount: number;
  savedDiscoveriesCount: number;
};

export async function getAccountShellData(userId: string): Promise<AccountShellData> {
  try {
    const [favoritesCount, savedDiscoveriesCount] = await Promise.all([
      prisma.favoriteProduct.count({ where: { userId } }),
      prisma.savedDiscovery.count({ where: { userId } }),
    ]);

    return {
      favoritesCount,
      savedDiscoveriesCount,
    };
  } catch {
    return {
      favoritesCount: 0,
      savedDiscoveriesCount: 0,
    };
  }
}
