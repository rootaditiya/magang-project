import rankingBimbelLogo from './assets/rankingBimbel.svg'
import rankingKelasLogo from './assets/rankingKelas.svg'
import rankingInstitusiLogo from './assets/rankingInstitusi.svg'
import { Button } from "@nextui-org/react";
import { useState } from "react";
import CardRanking from "./component/CardRanking";
import CardContent from './component/CardContent';

const Beranda = () => {
  const rankingBimbel = "2/10";
  const rankingKelas = "1/8";
  const rankingInstitusi = "5/20";
  const [category, setCategory] = useState("pppk");

  return (
    <div className='flex flex-col gap-8'>
      <section className="category flex gap-5">
        <Button
          onPress={() => {
            setCategory("pppk");
          }}
          color="default"
          size="lg"
          className={`${
            category === "pppk" ? "bg-asnesia-darkblue text-asnesia-yellow" : ""
          } font-semibold`}
        >
          PPPK 2024
        </Button>
        <Button
          onPress={() => {
            setCategory("cpns");
          }}
          color="default"
          size="lg"
          className={`${
            category === "cpns" ? "bg-asnesia-darkblue text-asnesia-yellow" : ""
          } font-semibold`}
        >
          CPNS 2024
        </Button>
      </section>
      <section className="ranking flex w-full gap-3">
        <CardRanking description="Peserta bimbel" ranking={rankingBimbel} logo={rankingBimbelLogo}/>
        <CardRanking description="Peserta Kelas" ranking={rankingKelas} logo={rankingKelasLogo}/>
        <CardRanking description="Peserta dengan tujuan institusi" ranking={rankingInstitusi} logo={rankingInstitusiLogo} />
      </section>
      <section className="score "><CardContent/></section>
    </div>
  );
};

export default Beranda;
