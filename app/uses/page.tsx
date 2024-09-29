import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Uses',
  description:
    "Here's what tech I'm currently using for coding, and creating.",
};

// OLD RIG
// GTX 1050
// INTEL PENTIUM G4560
// 8GB RAM

export default function UsesPage() {
  return (
    <section className={'animate-fadeIn'}>
      <h1 className="font-medium text-2xl mb-8 tracking-tighter">
        here's my setup
      </h1>
      <div className="prose-neutral dark:prose-invert">
        <h3 id="computer-office">my rig</h3>
        <ul>
          <li>Ryzen 5 5600X</li>
          <li>AMD RX 7600</li>
          <li>24GB RAM</li>
          <li>NZXT S340</li>
        </ul>
      </div>
    </section>
  );
}
