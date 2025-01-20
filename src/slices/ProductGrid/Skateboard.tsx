import { ButtonLink } from '@/components/ButtonLink';
import { HorizontalLine, VerticalLine } from '@/components/Line';
import { createClient } from '@/prismicio';
import { Content, isFilled } from '@prismicio/client';
import { PrismicNextImage } from '@prismicio/next';
import clsx from 'clsx';
import { FaStar } from 'react-icons/fa6';
import { Scribble } from './Scribble';

async function getDominantColor(url: string) {
  const paletteURL = new URL(url);
  paletteURL.searchParams.set('palette', 'json');

  const res = await fetch(paletteURL);
  const json = await res.json();

  return (
    json.dominant_colors.vibrant?.hex || json.dominant_colors.vibrant_light?.hex
  );
}

type Props = {
  id: string;
};

const VERTICAL_LINE_CLASSES =
  'absolute top-0 h-full stroke-2 text-stone-300 transition-colors group-hover:text-stone-400';

const HORIZONTAL_LINE_CLASSES =
  '-mx-8 stroke-2 text-stone-300 transition-colors group-hover:text-stone-400';

const Skateboard = async ({ id }: Props) => {
  const client = createClient();
  const skateboard = await client.getByID<Content.SkateboardDocument>(id);

  const price = isFilled.number(skateboard.data.price)
    ? `$${(skateboard.data.price / 100).toFixed(2)}`
    : 'Price is not available';

  const dominantColor = isFilled.image(skateboard.data.image)
    ? await getDominantColor(skateboard.data.image.url)
    : undefined;
  return (
    <div className="group relative mx-auto w-full max-w-72 px-8 pt-4">
      <VerticalLine className={clsx(VERTICAL_LINE_CLASSES, 'left-4')} />
      <VerticalLine className={clsx(VERTICAL_LINE_CLASSES, 'right-4')} />
      <HorizontalLine className={HORIZONTAL_LINE_CLASSES} />
      <div className="flex items-center justify-between ~text-sm/2xl">
        <span>{price}</span>
        <span className=" inline-flex items-center gap-1">
          <FaStar className="text-yellow-400" />
          {((Math.random() * 1000) / 8).toFixed(0)}
        </span>
      </div>

      <div className="-mb-1 py-4 overflow-hidden">
        <Scribble
          className="absolute inset-0 h-full w-full"
          color={dominantColor}
        />
        <PrismicNextImage
          alt=""
          field={skateboard.data.image}
          width={150}
          className="mx-auto w-[58%] transform-gpu transition-transform ease-in-out duration-500 group-hover:scale-150 origin-top"
        />
      </div>
      <HorizontalLine className={HORIZONTAL_LINE_CLASSES} />

      <h3 className="my-2 text-center ~text-lg/xl font-sans leading-tight">
        {skateboard.data.name}
      </h3>
      <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-200 group-hover:opacity-100">
        <ButtonLink field={skateboard.data.customizer_link}>
          Customize
        </ButtonLink>
      </div>
    </div>
  );
};

export default Skateboard;
