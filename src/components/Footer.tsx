import { createClient } from '@/prismicio';
import { PrismicNextImage, PrismicNextLink } from '@prismicio/next';
import { Logo } from './Logo';
import { Bounded } from './Bounded';
import { FooterPhysics } from './FooterPhysics';
import { asImageSrc } from '@prismicio/client';

const Footer = async () => {
  const client = createClient();
  const settings = await client.getSingle('settings');
  const boardTextureUrls = settings.data.footer_skateboards
    .map((item) => asImageSrc(item.skateboard, { h: 600 }))
    .filter((url): url is string => Boolean(url));
  console.log(boardTextureUrls);

  return (
    <footer className="bg-texture bg-zinc-900 text-white overflow-hidden">
      <div className=" relative h-[75vh] ~p-10/16 md:aspect-auto">
        <PrismicNextImage
          field={settings.data.footer_image}
          alt=""
          fill
          width={1200}
          className="object-cover"
        />
        <FooterPhysics
          boardTextureURLs={boardTextureUrls}
          className="absolute inset-0 overflow-hidden "
        />
        <Logo className="pointer-events-none relative h-20 mix-blend-exclusion md:h-28" />
      </div>
      <Bounded as="nav">
        <ul className="flex flex-wrap gap-8 items-center justify-center ">
          {settings.data.navigation.map((item) => (
            <li key={item.link.text} className="hover:underline ~text-lg/xl">
              <PrismicNextLink field={item.link} />
            </li>
          ))}
        </ul>
      </Bounded>
    </footer>
  );
};

export default Footer;
