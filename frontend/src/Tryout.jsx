import { useContext, useEffect, useState } from "react";
import CardContent from "./component/CardContent";
import { AuthContext } from "./main";
import {
  Button,
  Card,
  CardBody,
  Chip,
  CircularProgress,
} from "@nextui-org/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle, faClockRotateLeft } from "@fortawesome/free-solid-svg-icons";
import { formatDistanceToNow, parseISO } from "date-fns";
import { useNavigate } from "react-router";

const formatUpdatedAt = (dateString) => {
  const currentDate = new Date();
  const updatedAt = parseISO(dateString); // Parsing the ISO date string

  const yearsDifference = currentDate.getFullYear() - updatedAt.getFullYear();

  // If the difference is more than 3 years, return the full date in "dd:mm:yy hh:mm:ss" format
  if (yearsDifference > 3) {
    return `${updatedAt.getDate().toString().padStart(2, "0")}:${(
      updatedAt.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}:${updatedAt.getFullYear()} ${updatedAt
      .getHours()
      .toString()
      .padStart(2, "0")}:${updatedAt
      .getMinutes()
      .toString()
      .padStart(2, "0")}:${updatedAt.getSeconds().toString().padStart(2, "0")}`;
  }

  // Otherwise, return the time difference like "x minutes ago"
  return formatDistanceToNow(updatedAt) + " ago";
};

const Tryout = () => {
  const [exams, setExams] = useState(null); // State untuk menyimpan data exam
  const [loading, setLoading] = useState(true);
  const { getUser } = useContext(AuthContext);
  const auth = getUser();
  const navigate = useNavigate();

  useEffect(() => {
    const userID = auth; // Ganti dengan ID pengguna yang sesuai
    let interval;

    const fetchExams = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/exams/history?user_id=${userID}`
        );
        const data = await response.json();
        if (data.exams === null || data.exams.length === 0) {
          setExams(null);
        } else {
          setExams(data.exams);
        }
      } catch (error) {
        console.error("Error fetching exam data:", error);
        setExams(null); // Jika terjadi error, anggap data kosong
      } finally {
        setLoading(false);
      }
    };

    fetchExams();

    interval = setInterval(() => {
      fetchExams();
    }, 3000);

    return () => clearInterval(interval);

  }, [auth, navigate]);

  if (loading) {
    return <div>Loading...</div>; // Menampilkan loading saat data sedang diambil
  }

  return (
    <div className="flex flex-col gap-8">
      <section className="my-packages flex flex-col gap-5">
        {exams === null ? (
          <CardContent /> // Jika tidak ada data ujian, tampilkan CardContent
        ) : (
          exams.map((exam, index) => (
            <div key={index} className="exam-card">
              {/* Render kartu ujian sesuai dengan data exam */}
              <Card>
                <CardBody className="flex justify-between p-10">
                  <div className="exams flex gap-10">
                    <div className="exam-score">
                      <CircularProgress
                        color="success"
                        // formatOptions={{ style: "unit", unit: ".00" }}
                        label="Score"
                        showValueLabel={true}
                        size="lg"
                        value={exam.score}
                      />
                    </div>
                    <div className="exam-details">
                      <h2 className="text-2xl font-semibold">
                        {exam.packet.name}
                      </h2>
                      <p>{exam.packet.description}</p>
                      {exam.status && exam.status === 1 ? (
                        <small className="flex gap-3 mt-5 mb-5">
                          <FontAwesomeIcon icon={faClockRotateLeft} />
                          {formatUpdatedAt(exam.updated_at)}
                        </small>
                      ) : (
                        <small className="flex gap-3 mt-5 mb-5 text-green-500">
                          <FontAwesomeIcon icon={faCircle} />
                          Ujian sedang berlangsung
                        </small>
                      )}

                      <br />
                      <Button
                        color="primary"
                        onPress={() => {
                          navigate(`/service-puscharge/view/${exam.order_id}`);
                        }}
                      >
                        Detail
                      </Button>
                    </div>
                    {index === 0 && (
                      <Chip color="primary " className="ms-auto">
                        Baru
                      </Chip>
                    )}
                  </div>
                </CardBody>
              </Card>
            </div>
          ))
        )}
      </section>
    </div>
  );
};

export default Tryout;
