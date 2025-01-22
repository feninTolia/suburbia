import { Bounded } from '@/components/Bounded';
import { Heading } from '@/components/Heading';
import { Content, isFilled } from '@prismicio/client';
import {
  PrismicRichText,
  PrismicText,
  SliceComponentProps,
} from '@prismicio/react';
import { JSX } from 'react';
import Skateboard from './Skateboard';
import SlideIn from '@/components/SlideIn';

export type ProductGridProps = SliceComponentProps<Content.ProductGridSlice>;

const ProductGrid = ({ slice }: ProductGridProps): JSX.Element => {
  return (
    <Bounded
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="bg-texture bg-brand-gray"
    >
      <SlideIn>
        <Heading as="h2" className="text-center ~mb-4/6">
          <PrismicText field={slice.primary.heading} />
        </Heading>
      </SlideIn>
      <SlideIn>
        <div className="text-center ~mb-6-10">
          <PrismicRichText field={slice.primary.body} />
        </div>
      </SlideIn>

      <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {slice.primary.product.map(
          ({ skateboard }) =>
            isFilled.contentRelationship(skateboard) && (
              <Skateboard key={skateboard.id} id={skateboard.id} />
            )
        )}
      </div>
    </Bounded>
  );
};

export default ProductGrid;
