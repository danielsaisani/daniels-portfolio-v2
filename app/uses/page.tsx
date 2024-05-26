import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Uses',
  description:
    "Here's what tech I'm currently using for coding, and creating.",
};

export default function UsesPage() {
  return (
    <section>
      <h1 className="font-medium text-2xl mb-8 tracking-tighter">
        here's my setup
      </h1>
      <div className="prose prose-neutral dark:prose-invert">
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
