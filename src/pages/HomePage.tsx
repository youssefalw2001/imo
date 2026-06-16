import { Hero } from '@/components/sections/Hero';
import { AppSelector } from '@/components/sections/AppSelector';
import { PackageGrid } from '@/components/sections/PackageGrid';
import { Features } from '@/components/sections/Features';
import { useOrderStore } from '@/store/orderStore';

export function HomePage() {
  const selectedApp = useOrderStore((s) => s.selectedApp);
  return (
    <main>
      <Hero />
      <AppSelector />
      {selectedApp && <PackageGrid />}
      <Features />
    </main>
  );
}
