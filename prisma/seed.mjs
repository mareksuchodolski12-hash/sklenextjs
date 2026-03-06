import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

const categories = [
  {
    slug: 'flowering-perennials',
    name: 'Flowering Perennials',
    description: 'Hardworking plants that return year after year with elegant seasonal interest.',
  },
  {
    slug: 'structural-plants',
    name: 'Structural Plants',
    description: 'Architectural greenery and grasses to shape outdoor spaces.',
  },
  {
    slug: 'pollinator-favorites',
    name: 'Pollinator Favorites',
    description: 'Nectar-rich outdoor plants that support bees and butterflies.',
  },
];

const tags = ['sun-loving', 'border', 'pollinator-friendly', 'fragrant', 'statement shrub'];

const collections = [
  {
    slug: 'sun-loving-essentials',
    title: 'Sun-Loving Essentials',
    subtitle: 'For bright borders and patio edges',
    description:
      'Resilient flowers and grasses selected for warmth, fragrance, and long seasonal performance.',
    isFeatured: true,
  },
  {
    slug: 'architectural-silhouettes',
    title: 'Architectural Silhouettes',
    subtitle: 'Structure for modern landscapes',
    description: 'Sculptural shapes and height contrasts to anchor contemporary garden plans.',
    isFeatured: true,
  },
];

const products = [
  {
    slug: 'salvia-caradonna',
    sku: 'SAL-CAR-001',
    name: 'Salvia Caradonna',
    shortDescription: 'Deep violet spikes for long summer color and pollinator activity.',
    longDescription:
      'Salvia Caradonna adds vertical rhythm to borders with richly colored stems and repeat flowering through summer.',
    price: new Prisma.Decimal('26.00'),
    compareAtPrice: new Prisma.Decimal('32.00'),
    featured: true,
    stockStatus: 'in_stock',
    quantityOnHand: 120,
    quantityReserved: 8,
    lowStockThreshold: 15,
    minHardinessZone: 4,
    maxHardinessZone: 9,
    sunlight: 'full_sun',
    watering: 'low',
    difficulty: 'easy',
    floweringSeasons: ['summer', 'autumn'],
    colorPalette: ['purple', 'green'],
    styles: ['cottage', 'contemporary', 'wildlife_friendly'],
    effects: ['pollinator_habitat', 'structural_interest'],
    categorySlug: 'flowering-perennials',
    tagSlugs: ['sun-loving', 'border', 'pollinator-friendly'],
    collectionSlugs: ['sun-loving-essentials'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1463320898484-cdee8141c787?auto=format&fit=crop&w=1200&q=80',
        alt: 'Purple salvia flowers in a sunny garden bed',
        position: 0,
        isPrimary: true,
      },
    ],
    attributes: [
      { slug: 'height-cm', name: 'Height', valueType: 'number', valueNumber: '70', unit: 'cm' },
      { slug: 'spread-cm', name: 'Spread', valueType: 'number', valueNumber: '45', unit: 'cm' },
      { slug: 'pet-safe', name: 'Pet Safe', valueType: 'boolean', valueBoolean: true },
    ],
  },
  {
    slug: 'hydrangea-limelight',
    sku: 'HYD-LIM-001',
    name: 'Hydrangea Limelight',
    shortDescription: 'Large lime-white panicles with dramatic late-season structure.',
    longDescription:
      'Hydrangea Limelight is prized for cone-shaped blooms that shift from fresh green to cream and blush through the season.',
    price: new Prisma.Decimal('48.00'),
    featured: true,
    stockStatus: 'low_stock',
    quantityOnHand: 14,
    quantityReserved: 3,
    lowStockThreshold: 12,
    minHardinessZone: 3,
    maxHardinessZone: 8,
    sunlight: 'partial_shade',
    watering: 'moderate',
    difficulty: 'moderate',
    floweringSeasons: ['summer', 'autumn'],
    colorPalette: ['cream', 'green', 'pink'],
    styles: ['cottage', 'contemporary'],
    effects: ['focal_point', 'structural_interest'],
    categorySlug: 'flowering-perennials',
    tagSlugs: ['statement shrub'],
    collectionSlugs: ['architectural-silhouettes'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1463936575829-25148e1db1b8?auto=format&fit=crop&w=1200&q=80',
        alt: 'Hydrangea panicles in pale green and cream tones',
        position: 0,
        isPrimary: true,
      },
    ],
    attributes: [
      { slug: 'height-cm', name: 'Height', valueType: 'number', valueNumber: '180', unit: 'cm' },
      { slug: 'spread-cm', name: 'Spread', valueType: 'number', valueNumber: '160', unit: 'cm' },
    ],
  },
  {
    slug: 'lavender-hidcote',
    sku: 'LAV-HID-001',
    name: 'Lavender Hidcote',
    shortDescription: 'Compact fragrant lavender ideal for pathways and sunny terraces.',
    longDescription:
      'Lavender Hidcote creates a clean, aromatic edge in formal or relaxed planting schemes and tolerates dry summer conditions.',
    price: new Prisma.Decimal('22.00'),
    compareAtPrice: new Prisma.Decimal('27.00'),
    featured: false,
    stockStatus: 'in_stock',
    quantityOnHand: 88,
    quantityReserved: 5,
    lowStockThreshold: 10,
    minHardinessZone: 5,
    maxHardinessZone: 9,
    sunlight: 'full_sun',
    watering: 'low',
    difficulty: 'easy',
    floweringSeasons: ['spring', 'summer'],
    colorPalette: ['purple', 'silver', 'green'],
    styles: ['mediterranean', 'cottage'],
    effects: ['fragrance', 'pollinator_habitat'],
    categorySlug: 'pollinator-favorites',
    tagSlugs: ['fragrant', 'pollinator-friendly', 'sun-loving'],
    collectionSlugs: ['sun-loving-essentials'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?auto=format&fit=crop&w=1200&q=80',
        alt: 'Lavender field in bloom with purple flowers',
        position: 0,
        isPrimary: true,
      },
    ],
    attributes: [
      { slug: 'height-cm', name: 'Height', valueType: 'number', valueNumber: '40', unit: 'cm' },
      { slug: 'spread-cm', name: 'Spread', valueType: 'number', valueNumber: '45', unit: 'cm' },
      { slug: 'pet-safe', name: 'Pet Safe', valueType: 'boolean', valueBoolean: true },
    ],
  },
];

async function main() {
  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: category,
      create: category,
    });
  }

  for (const tagLabel of tags) {
    const slug = tagLabel.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    await prisma.tag.upsert({
      where: { slug },
      update: { label: tagLabel },
      create: { slug, label: tagLabel },
    });
  }

  for (const collection of collections) {
    await prisma.collection.upsert({
      where: { slug: collection.slug },
      update: collection,
      create: collection,
    });
  }

  for (const product of products) {
    const category = await prisma.category.findUniqueOrThrow({
      where: { slug: product.categorySlug },
    });

    const existing = await prisma.product.findUnique({ where: { slug: product.slug } });

    const baseData = {
      slug: product.slug,
      sku: product.sku,
      name: product.name,
      shortDescription: product.shortDescription,
      longDescription: product.longDescription,
      price: product.price,
      compareAtPrice: product.compareAtPrice ?? null,
      featured: product.featured,
      stockStatus: product.stockStatus,
      quantityOnHand: product.quantityOnHand,
      quantityReserved: product.quantityReserved,
      lowStockThreshold: product.lowStockThreshold,
      minHardinessZone: product.minHardinessZone,
      maxHardinessZone: product.maxHardinessZone,
      sunlight: product.sunlight,
      watering: product.watering,
      difficulty: product.difficulty,
      floweringSeasons: product.floweringSeasons,
      colorPalette: product.colorPalette,
      styles: product.styles,
      effects: product.effects,
      categoryId: category.id,
    };

    const dbProduct = existing
      ? await prisma.product.update({ where: { id: existing.id }, data: baseData })
      : await prisma.product.create({ data: baseData });

    await prisma.productImage.deleteMany({ where: { productId: dbProduct.id } });
    await prisma.productAttribute.deleteMany({ where: { productId: dbProduct.id } });
    await prisma.productTag.deleteMany({ where: { productId: dbProduct.id } });
    await prisma.productCollection.deleteMany({ where: { productId: dbProduct.id } });

    await prisma.productImage.createMany({
      data: product.images.map((image) => ({
        productId: dbProduct.id,
        url: image.url,
        alt: image.alt,
        position: image.position,
        isPrimary: image.isPrimary,
      })),
    });

    for (const [index, collectionSlug] of product.collectionSlugs.entries()) {
      const collection = await prisma.collection.findUniqueOrThrow({
        where: { slug: collectionSlug },
      });
      await prisma.productCollection.create({
        data: { productId: dbProduct.id, collectionId: collection.id, sortOrder: index },
      });
    }

    for (const tagSlug of product.tagSlugs) {
      const tag = await prisma.tag.findUniqueOrThrow({ where: { slug: tagSlug } });
      await prisma.productTag.create({
        data: { productId: dbProduct.id, tagId: tag.id },
      });
    }

    for (const attribute of product.attributes) {
      await prisma.productAttribute.create({
        data: {
          productId: dbProduct.id,
          slug: attribute.slug,
          name: attribute.name,
          valueType: attribute.valueType,
          valueText: attribute.valueText ?? null,
          valueNumber:
            attribute.valueNumber !== undefined ? new Prisma.Decimal(attribute.valueNumber) : null,
          valueBoolean: attribute.valueBoolean ?? null,
          unit: attribute.unit ?? null,
        },
      });
    }
  }

  const salvia = await prisma.product.findUnique({ where: { slug: 'salvia-caradonna' } });
  const lavender = await prisma.product.findUnique({ where: { slug: 'lavender-hidcote' } });
  if (salvia && lavender) {
    await prisma.productRelation.upsert({
      where: {
        sourceProductId_targetProductId: {
          sourceProductId: salvia.id,
          targetProductId: lavender.id,
        },
      },
      update: { reason: 'pairs_well_in_pollinator_borders' },
      create: {
        sourceProductId: salvia.id,
        targetProductId: lavender.id,
        reason: 'pairs_well_in_pollinator_borders',
      },
    });
  }

  await prisma.savedDiscovery.deleteMany({ where: { sessionId: 'seed-session' } });

  await prisma.savedDiscovery.create({
    data: {
      sessionId: 'seed-session',
      title: 'Sunny Pollinator Border Starter',
      criteria: {
        styles: ['wildlife_friendly'],
        sunlight: 'full_sun',
        goals: ['pollinator_habitat', 'fragrance'],
      },
      resultSlugs: ['salvia-caradonna', 'lavender-hidcote'],
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
