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

  console.log(orderid, packetid, userid);

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
      const errorData = await response.json();
      throw new Error(
        errorData.error || "Terjadi kesalahan saat memulai ujian"
      );
    }

    // Mengambil data respons
    const data = await response.json();
    console.log("Exam created:", data);
    return data;
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
  }
};

const checkExam = async (orderid) => {
  try {
    const response = await fetch(
      `http://localhost:8080/exams/order?order_id=${orderid}`
    );

    if (!response.ok) {
      throw new Error("Gagal memeriksa ujian");
    }

    const data = await response.json();
    console.log("DATA EXAM",data);
    return data; // Data ujian
  } catch (error) {
    console.error("Error checking exam:", error);
    return null;
  }
};

const formatTimeAgo = (date) => {
  const now = new Date();
  const diffInSeconds = Math.floor((now - new Date(date)) / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  const diffInMonths = Math.floor(diffInDays / 30);

  if (diffInSeconds < 60) return "baru saja";
  if (diffInMinutes < 60) return `${diffInMinutes} menit yang lalu`;
  if (diffInHours < 24) return `${diffInHours} jam yang lalu`;
  if (diffInDays < 30) return `${diffInDays} hari yang lalu`;
  if (diffInMonths < 1) return `${diffInMonths} bulan yang lalu`;
  return new Date(date).toLocaleString(); // Jika lebih dari 1 bulan, tampilkan tanggal dan waktu lengkap
};

const PackageDetail = () => {
  const { auth } = useContext(AuthContext);
  const { orderid } = useParams();
  const navigate = useNavigate();
  // const [auth, setAuth] = useState(getUser());
  console.log(orderid);
  const [packageData, setPackageData] = useState(null);
  const [examData, setExamData] = useState(null);

  const handleStart = async () => {
    try {
      const response = await startExam(orderid, packageData.packet.ID, auth);
      // setExamData(response);
      console.log(response);

      if (response && response.id) {
        // Jika ada id, navigasikan ke halaman ujian
        navigate(`/exams/${response.id}`);
      } else {
        // Jika tidak ada id dalam response, tampilkan alert error
        alert("Gagal memulai ujian: ID ujian tidak ditemukan.");
      }
    } catch (error) {
      console.error("Error starting exam:", error);
    }
  };

  const handleContinue = (examId) => {
    navigate(`/exams/${examId}`);
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
      } catch (error) {
        console.error("Error fetching package data:", error);
      }
    };

    const checkExistingExam = async () => {
      if (orderid && auth) {
        const exam = await checkExam(orderid);
        if (exam) {
          setExamData(exam);
        }
      }
    };

    if (orderid && auth) {
      fetchPackageData();
      checkExistingExam();
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
        {examData ? (
          examData.status === 0 ? (
            <Button
              color="primary"
              className="text-lg mt-10"
              onPress={() => handleContinue(examData.id)}
            >
              Lanjutkan Exam
            </Button>
          ) : (
            <div className="text-xl mt-10">
              <p>
                Status: Selesai
                <br />
                <span>{formatTimeAgo(examData.ended_at)}</span>
              </p>
              <p>Skor: {examData.score}</p>
            </div>
          )
        ) : (
          <Button
            color="primary"
            className="text-lg mt-10"
            onPress={handleStart}
          >
            Mulai Exam
          </Button>
        )}
      </CardBody>
    </Card>
  );
};

export default PackageDetail;
