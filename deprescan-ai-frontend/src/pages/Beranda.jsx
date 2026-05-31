import Hero from '../components/beranda/Hero';
import Section2 from '../components/beranda/Section2';
import Section3 from '../components/beranda/Section3';

export default function Beranda() {
  return (
    <div className="w-full">
      <Hero />
      <Section2 />
      <Section3 />
    </div>
  );
}
