'use client';

import Image from 'next/image';
import { useMemo, useState } from 'react';

import {
  discoveryPlants,
  type DiscoveryPlant,
} from '@/features/discovery/data/mock-discovery-plants';

const SWIPE_THRESHOLD = 110;

export function PlantDiscoveryExperience() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [savedPlantIds, setSavedPlantIds] = useState<string[]>([]);
  const [detailsPlantId, setDetailsPlantId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState(0);
  const [dragStartX, setDragStartX] = useState<number | null>(null);

  const currentPlant = discoveryPlants[activeIndex];
  const visibleCards = discoveryPlants.slice(activeIndex, activeIndex + 3);
  const savedPlants = useMemo(
    () => discoveryPlants.filter((plant) => savedPlantIds.includes(plant.id)),
    [savedPlantIds],
  );

  const moveNext = () => {
    setDragOffset(0);
    setDragStartX(null);
    setActiveIndex((index) => Math.min(index + 1, discoveryPlants.length));
  };

  const handleSave = () => {
    if (!currentPlant) {
      return;
    }

    setSavedPlantIds((ids) => (ids.includes(currentPlant.id) ? ids : [...ids, currentPlant.id]));
    moveNext();
  };

  const handleSkip = () => {
    if (!currentPlant) {
      return;
    }

    moveNext();
  };

  const handlePointerDown = (clientX: number) => setDragStartX(clientX);

  const handlePointerMove = (clientX: number) => {
    if (dragStartX === null) {
      return;
    }

    setDragOffset(clientX - dragStartX);
  };

  const handlePointerUp = () => {
    if (Math.abs(dragOffset) >= SWIPE_THRESHOLD) {
      if (dragOffset > 0) {
        handleSave();
        return;
      }

      handleSkip();
      return;
    }

    setDragOffset(0);
    setDragStartX(null);
  };

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
      <section aria-label="Plant discovery cards" className="space-y-6">
        <header className="space-y-3">
          <p className="text-xs uppercase tracking-[0.18em] text-brand-sage">Discovery studio</p>
          <h1 className="font-serif text-4xl text-brand-moss sm:text-5xl">
            Find your next garden favorite
          </h1>
          <p className="max-w-2xl text-sm leading-relaxed text-brand-charcoal/75 sm:text-base">
            Explore curated flower picks by mood, visual effect, and practical growing traits. Swipe
            or use controls to save the plants that fit your space.
          </p>
        </header>

        <div className="rounded-3xl border border-brand-sage/20 bg-white p-5 shadow-soft sm:p-7">
          {currentPlant ? (
            <>
              <div className="relative mx-auto h-[470px] w-full max-w-xl overflow-hidden rounded-2xl bg-brand-cream/60">
                {visibleCards.map((plant, index) => {
                  const isActive = index === 0;
                  const fallbackOffset = index * 12;
                  const stackScale = 1 - index * 0.04;
                  const activeRotation = dragOffset * 0.04;

                  return (
                    <article
                      key={plant.id}
                      className="absolute inset-0 overflow-hidden rounded-2xl border border-brand-sage/20 bg-white"
                      style={{
                        transform: isActive
                          ? `translateX(${dragOffset}px) rotate(${activeRotation}deg)`
                          : `translateY(${fallbackOffset}px) scale(${stackScale})`,
                        zIndex: 20 - index,
                        transition:
                          dragStartX === null ? 'transform 220ms ease, opacity 220ms ease' : 'none',
                        opacity: isActive || index < 2 ? 1 : 0,
                      }}
                      onPointerDown={
                        isActive ? (event) => handlePointerDown(event.clientX) : undefined
                      }
                      onPointerMove={
                        isActive ? (event) => handlePointerMove(event.clientX) : undefined
                      }
                      onPointerUp={isActive ? handlePointerUp : undefined}
                      onPointerCancel={isActive ? handlePointerUp : undefined}
                    >
                      <div className="relative h-56 w-full">
                        <Image
                          src={plant.image.src}
                          alt={plant.image.alt}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 560px"
                        />
                      </div>
                      <div className="space-y-4 p-5">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h2 className="font-serif text-3xl text-brand-moss">{plant.name}</h2>
                            <p className="mt-2 text-sm leading-relaxed text-brand-charcoal/75">
                              {plant.appeal}
                            </p>
                          </div>
                          <p className="text-lg font-semibold text-brand-moss">€{plant.price}</p>
                        </div>
                        <TraitChips plant={plant} />
                      </div>
                    </article>
                  );
                })}
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={handleSkip}
                  className="rounded-full border border-brand-sage/35 px-5 py-2 text-sm font-semibold text-brand-charcoal transition hover:border-brand-sage"
                >
                  Skip
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="rounded-full bg-brand-moss px-5 py-2 text-sm font-semibold text-brand-cream transition hover:bg-brand-moss/90"
                >
                  Save discovery
                </button>
                <button
                  type="button"
                  onClick={() => setDetailsPlantId(currentPlant.id)}
                  className="rounded-full border border-brand-moss/25 bg-brand-cream px-5 py-2 text-sm font-semibold text-brand-moss transition hover:border-brand-moss/45"
                >
                  View details
                </button>
              </div>
            </>
          ) : (
            <div className="rounded-2xl border border-dashed border-brand-sage/35 bg-brand-cream/50 p-10 text-center">
              <h2 className="font-serif text-3xl text-brand-moss">
                You reached the end of this discovery set
              </h2>
              <p className="mt-3 text-sm text-brand-charcoal/75">
                Saved picks remain on the right so you can shortlist what to explore next.
              </p>
              <button
                type="button"
                onClick={() => {
                  setActiveIndex(0);
                  setDragOffset(0);
                  setDragStartX(null);
                }}
                className="mt-6 rounded-full border border-brand-sage/35 px-5 py-2 text-sm font-semibold text-brand-moss"
              >
                Start over
              </button>
            </div>
          )}
        </div>
      </section>

      <aside className="space-y-5 rounded-3xl border border-brand-sage/20 bg-white p-5 shadow-soft sm:p-6 lg:sticky lg:top-24">
        <h2 className="font-serif text-2xl text-brand-moss">Saved discoveries</h2>
        <p className="text-sm text-brand-charcoal/75">
          A temporary shortlist stored in this browser session.
        </p>
        {savedPlants.length > 0 ? (
          <ul className="space-y-3">
            {savedPlants.map((plant) => (
              <li
                key={plant.id}
                className="rounded-2xl border border-brand-sage/20 bg-brand-cream/40 p-3"
              >
                <p className="text-sm font-semibold text-brand-moss">{plant.name}</p>
                <p className="text-xs text-brand-charcoal/70">{plant.appeal}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="rounded-2xl border border-dashed border-brand-sage/35 p-4 text-sm text-brand-charcoal/70">
            Save a few plants to compare mood and practical fit before opening full product pages.
          </p>
        )}
      </aside>

      {detailsPlantId ? (
        <DetailsDialog
          plant={discoveryPlants.find((plant) => plant.id === detailsPlantId)}
          onClose={() => setDetailsPlantId(null)}
        />
      ) : null}
    </div>
  );
}

function TraitChips({ plant }: { plant: DiscoveryPlant }) {
  const traits = [
    plant.traits.light,
    plant.traits.bloom,
    plant.traits.care,
    plant.traits.pollinatorFriendly ? 'Pollinator friendly' : 'Low pollinator impact',
  ];

  return (
    <ul className="flex flex-wrap gap-2" aria-label="Key traits">
      {traits.map((trait) => (
        <li
          key={trait}
          className="rounded-full bg-brand-cream px-3 py-1 text-xs font-semibold text-brand-moss"
        >
          {trait}
        </li>
      ))}
    </ul>
  );
}

function DetailsDialog({
  plant,
  onClose,
}: {
  plant: DiscoveryPlant | undefined;
  onClose: () => void;
}) {
  if (!plant) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-brand-charcoal/40 p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`${plant.name} details`}
    >
      <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-soft">
        <h3 className="font-serif text-3xl text-brand-moss">{plant.name}</h3>
        <p className="mt-3 text-sm leading-relaxed text-brand-charcoal/80">{plant.appeal}</p>
        <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
          <DetailRow label="Light" value={plant.traits.light} />
          <DetailRow label="Bloom" value={plant.traits.bloom} />
          <DetailRow label="Care" value={plant.traits.care} />
          <DetailRow
            label="Pollinator"
            value={plant.traits.pollinatorFriendly ? 'Friendly' : 'Limited'}
          />
        </dl>
        <div className="mt-5">
          <p className="text-xs uppercase tracking-[0.16em] text-brand-sage">Mood matches</p>
          <p className="mt-1 text-sm text-brand-charcoal/75">{plant.moods.join(' · ')}</p>
        </div>
        <div className="mt-5 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-brand-sage/35 px-5 py-2 text-sm font-semibold text-brand-moss"
          >
            Close details
          </button>
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-brand-cream/60 p-3">
      <dt className="text-xs uppercase tracking-[0.12em] text-brand-sage">{label}</dt>
      <dd className="mt-1 font-medium text-brand-charcoal">{value}</dd>
    </div>
  );
}
