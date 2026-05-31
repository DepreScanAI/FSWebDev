import Header    from '../components/tentang/Header';
import VisiMisi  from '../components/tentang/VisiMisi';
import Alasan   from '../components/tentang/Alasan';
import Disclaimer from '../components/tentang/Disclaimer';
import Screening from '../components/tentang/Screening';

export default function Tentang() {
  return (
    <div className="w-full">
      <Header />
      <VisiMisi />
      <Alasan />
      <Disclaimer />
      <Screening />
    </div>
  );
}