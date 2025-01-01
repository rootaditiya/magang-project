import NoContent from '../assets/noKonten.svg'
import { Button, Image } from "@nextui-org/react";

const CardContent = () => {
  return (
    <div className="flex flex-col items-center text-center bg-white rounded-xl py-10">
      <Image
        alt="NextUI hero Image"
        src={NoContent}
        width={300}
      />
      <p className="title font-semibold text-2xl mb-5">
        Belum ada data nih, yuk beli paket belajar & Try Out sekarang!
      </p>
      <p className="title font-thin text-base text-asnesia-gray mb-5">
        Raih karir impianmu dengan paket belajar & try out dan dapatkan analisis
        perkembanganmu secara akurat dan mendalam
      </p>
      <Button
        size="lg"
        className="bg-asnesia-yellow text-asnesia-darkblue font-semibold"
      >
        Beli Paket
      </Button>
    </div>
  );
};

export default CardContent;
