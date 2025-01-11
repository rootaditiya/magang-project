import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Image,
} from "@nextui-org/react";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "./main";
import PackageImage from "./assets/Package.svg";

const startExam = async (orderid, packetid, userid) => {

  if (!orderid || !packetid || !userid) {
    console.error("Missing required parameters: orderid, packetid, or userid");
    return;
  }

  console.log(orderid, packetid, userid)

  try {
    const response = await fetch("http://localhost:8080/exams", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        order_id: parseInt(orderid),
        packet_id: parseInt(packetid),
        user_id: parseInt(userid),
        score: 0.0, 
      }),
    });

    // Mengecek apakah response status sukses
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    // Mengambil data respons
    const data = await response.json();
    console.log("Exam created:", data);
    return data;
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
  }
};

const PackageDetail = () => {
  const { auth } = useContext(AuthContext);
  const { orderid } = useParams();
  const navigate = useNavigate();
  // const [auth, setAuth] = useState(getUser());
  console.log(orderid);
  const [packageData, setPackageData] = useState(null);
  // const [examData, setExamData] = useState(null);

  const handleStart = async () => {
    try {
      const response = await startExam(orderid, packageData.packet.ID, auth);
      // setExamData(response);
      console.log(response);
      await response.id ? navigate(`/exams/${response.id}`) : alert('gagal memulai ujian');
    } catch (error) {
      console.error("Error starting exam:", error);
    }
  };

  useEffect(() => {
    const fetchPackageData = async () => {
      try {
        const response = await fetch(`http://localhost:8080/orders/${orderid}`);

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        setPackageData(data);
        console.log(data);
      } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
      }
    };

    if (orderid && auth) {
      fetchPackageData();
    }
  }, [orderid, auth]);

  if (!packageData) {
    return <div>Loading...</div>;
  }

  return (
    <Card className="">
      <CardHeader className="flex gap-3 justify-center">
        <Image
          alt="nextui logo"
          height={40}
          radius="sm"
          src={PackageImage}
          width={40}
        />
        <div className="flex flex-col">
          <p className="text-2xl font-semibold">
            {packageData.packet.NamePacket}
          </p>
        </div>
      </CardHeader>
      <Divider />
      <CardBody className="flex flex-col gap-3 items-center text-center p-10">
        <p className="text-xl">{packageData.packet.Description}</p>
        <Button color="primary" className="text-lg mt-10 " onClick={handleStart}>
          Mulai Exam?
        </Button>
        ;
      </CardBody>
    </Card>
  );
};

export default PackageDetail;
