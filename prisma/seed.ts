import { PrismaClient } from '@prisma/client';

import { mockCollections, mockProducts, productCategories } from '../src/data/mock/catalog';

const prisma = new PrismaClient();

const toEnum = <T extends string>(value: string) => value.toUpperCase().replace(/-/g, '_') as T;

async function seed() {
  await prisma.productRelation.deleteMany();
  await prisma.collectionProduct.deleteMany();
  await prisma.productTag.deleteMany();
  await prisma.productAttribute.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.collection.deleteMany();
  await prisma.product.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.category.deleteMany();

  const categoryBySlug = new Map<string, string>();

  for (const category of productCategories) {
    const created = await prisma.category.create({
      data: {
        slug: category.slug,
        name: category.name,
        description: category.description,
      },
    });

    categoryBySlug.set(created.slug, created.id);
  }

  const tagByLabel = new Map<string, string>();

  for (const product of mockProducts) {
    const categoryId = categoryBySlug.get(product.category);
    if (!categoryId) {
      throw new Error(`Missing category for product ${product.slug}`);
    }

    const createdProduct = await prisma.product.create({
      data: {
        sku: product.id,
        slug: product.slug,
        name: product.name,
        shortDescription: product.shortDescription,
        longDescription: product.longDescription,
        priceCents: Math.round(product.price * 100),
        compareAtPriceCents: product.compareAtPrice
          ? Math.round(product.compareAtPrice * 100)
          : null,
        categoryId,
        sunlight: toEnum(product.sunlight),
        watering: toEnum(product.watering),
        difficulty: toEnum(product.difficulty),
        floweringSeasons: product.floweringSeasons.map((season) => toEnum(season)),
        styles: product.styles.map((style) => toEnum(style)),
        effects: product.effects.map((effect) => toEnum(effect)),
        colorPalette: product.colorPalette.map((tone) => toEnum(tone)),
        badges: product.badges.map((badge) => toEnum(badge)),
        pollinatorFriendly: product.pollinatorFriendly,
        petSafe: product.petSafe,
        featured: product.featured,
        stockStatus: toEnum(product.stockStatus),
        inventoryQuantity:
          product.stockStatus === 'out_of_stock' ? 0 : product.stockStatus === 'low_stock' ? 2 : 25,
        heightCm: product.dimensions.heightCm,
        spreadCm: product.dimensions.spreadCm,
        hardinessZoneMin: product.hardinessZone?.min,
        hardinessZoneMax: product.hardinessZone?.max,
        plantingNotes: product.plantingNotes,
        careNotes: product.careNotes,
        idealPlacement: product.idealPlacement,
        images: {
          create: product.images.map((image, index) => ({
            url: image.src,
            alt: image.alt,
            position: index,
          })),
        },
        attributes: {
          create: [
            { key: 'source', value: 'mock_catalog' },
            { key: 'legacy_id', value: product.id },
          ],
        },
      },
    });

    for (const tagLabel of product.tags) {
      const slug = tagLabel
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      const existingTagId = tagByLabel.get(tagLabel);
      const tagId =
        existingTagId ??
        (
          await prisma.tag.create({
            data: {
              slug,
              label: tagLabel,
            },
          })
        ).id;

      tagByLabel.set(tagLabel, tagId);

      await prisma.productTag.create({
        data: {
          productId: createdProduct.id,
          tagId,
        },
      });
    }
  }

  for (const collection of mockCollections) {
    const createdCollection = await prisma.collection.create({
      data: {
        slug: collection.slug,
        title: collection.title,
        subtitle: collection.subtitle,
        description: collection.description,
        season: collection.season ? toEnum(collection.season) : null,
        style: collection.style ? toEnum(collection.style) : null,
      },
    });

    for (const [position, productSlug] of collection.productSlugs.entries()) {
      const product = await prisma.product.findUnique({
        where: { slug: productSlug },
        select: { id: true },
      });

      if (!product) {
        throw new Error(`Missing product ${productSlug} for collection ${collection.slug}`);
      }

      await prisma.collectionProduct.create({
        data: {
          collectionId: createdCollection.id,
          productId: product.id,
          position,
        },
      });
    }
  }

  const products = await prisma.product.findMany({
    select: { id: true, slug: true, categoryId: true },
  });

  for (const source of products) {
    const related = products
      .filter((candidate) => candidate.id !== source.id)
      .filter((candidate) => candidate.categoryId === source.categoryId)
      .slice(0, 3);

    for (const candidate of related) {
      await prisma.productRelation.create({
        data: {
          fromProductId: source.id,
          toProductId: candidate.id,
          reason: 'shared_category',
          score: 1,
        },
      });
    }
  }
}

seed()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
