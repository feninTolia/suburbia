import Link from 'next/link';
import { ButtonLink } from './ButtonLink';
import { Logo } from './Logo';
import { createClient } from '@/prismicio';
import { PrismicNextLink } from '@prismicio/next';

export const Header = async () => {
  const client = createClient();
  const settings = await client.getSingle('settings');
  return (
    <header className="header absolute top-0 left-0 right-0 z-10 ~h-32/48 ~px-4/6 ~py-4/6 md:h-32">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-[auto,auto] items-center gap-6 md:grid-cols-[1fr,auto,1fr] ">
        <Link className="justify-self-start" href={'/'}>
          <Logo className="text-brand-purple ~h-12/20" />
        </Link>
        <nav
          aria-label="Main"
          className="col-span-full row-start-2 md:col-span-1 md:col-start-2 md:row-start-1"
        >
          <ul className="flex flex-wrap items-center justify-center gap-8">
            {settings.data.navigation.map((item) => (
              <li key={item.link.text}>
                <PrismicNextLink field={item.link} className="~text-lg/xl" />
              </li>
            ))}
          </ul>
        </nav>
        <div className="justify-self-end">
          <ButtonLink href="" icon="cart" color="purple" aria-label="Cart (1)">
            <span className="md:hidden">1</span>
            <span className="hidden md:inline">Cart (1)</span>
          </ButtonLink>
        </div>
      </div>
    </header>
  );
};
