declare module '@prisma/client' {
  export class PrismaClient {
    [key: string]: unknown;
  }

  export namespace Prisma {
    class Decimal {
      constructor(value: string | number);
    }
  }
}
