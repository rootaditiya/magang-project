import NoContent from "../assets/noKonten.svg";
import { Button, Image } from "@nextui-org/react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router";

const CardContent = ({
  content = "Belum ada data nih, yuk beli paket belajar & Try Out sekarang!",
  description = "Raih karir impianmu dengan paket belajar & try out dan dapatkan analisis perkembanganmu secara akurat dan mendalam",
  button = { title: "Beli Package", link: "/service-available" },
}) => {
  
  
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col items-center text-center bg-white rounded-xl py-10">
      <Image alt="NextUI hero Image" src={NoContent} width={300} />
      <p className="title font-semibold text-2xl mb-5">{content}</p>
      <p className="title font-thin text-base text-asnesia-gray mb-5">
        {description}
      </p>
      <Button
        onPress={() => {
          navigate(button.link);
        }}
        size="lg"
        className="bg-asnesia-yellow text-asnesia-darkblue font-semibold"
      >
        {button.title}
      </Button>
    </div>
  );
};

CardContent.propTypes = {
  content: PropTypes.string,
  description: PropTypes.string,
  button: PropTypes.object,
};

export default CardContent;
