import { Bounded } from '@/components/Bounded';
import { Heading } from '@/components/Heading';
import SlideIn from '@/components/SlideIn';
import { createClient } from '@/prismicio';
import { Content } from '@prismicio/client';
import { PrismicText, SliceComponentProps } from '@prismicio/react';
import React, { JSX } from 'react';
import { Skater } from './Skater';

/**
 * Props for `TeamGrid`.
 */
export type TeamGridProps = SliceComponentProps<Content.TeamGridSlice>;

/**
 * Component for "TeamGrid" Slices.
 */
const TeamGrid = async ({ slice }: TeamGridProps): Promise<JSX.Element> => {
  const client = createClient();
  const skaters = await client.getAllByType('skater');

  return (
    <Bounded
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="bg-brand-navy bg-texture"
    >
      <SlideIn>
        <Heading size="lg" as="h2" className="text-white mb-8 text-center">
          <PrismicText field={slice.primary.heading} />
        </Heading>
      </SlideIn>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
        {skaters.map((skater, index) => (
          <React.Fragment key={index}>
            {skater.data.first_name && (
              <SlideIn>
                <Skater skater={skater} index={index} />
              </SlideIn>
            )}
          </React.Fragment>
        ))}
      </div>
    </Bounded>
  );
};

export default TeamGrid;
