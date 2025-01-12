import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Radio,
  RadioGroup,
  useDisclosure,
} from "@nextui-org/react";
import { useNavigate, useParams } from "react-router";
import Brand from "./assets/brand.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle } from "@fortawesome/free-solid-svg-icons";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "./main";

const formatDuration = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  return `${hours} jam ${minutes} menit ${remainingSeconds} detik`;
};

const calculateScore = async (packetId, userAnswers) => {
  try {
    const answersData = userAnswers.map((answer) => ({
      question_id: answer.question_id,
      answer: answer.answer,
    }));

    const response = await fetch("http://localhost:8080/score", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        packet_id: packetId, // Mengirim packetId
        answers: answersData,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      // Return skor dari API response
      return data.score; // Mengembalikan skor untuk digunakan di handleFinish
    } else {
      console.error("Error menghitung skor:", data.error);
    }
  } catch (error) {
    console.error("Terjadi kesalahan saat menghitung skor:", error);
  }
};

const updateExam = async (examId, score) => {
  try {
    const response = await fetch(`http://localhost:8080/exams/${examId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        score: score,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      console.log("Ujian berhasil diperbarui:", data);
      return data; // Mengembalikan respons jika berhasil
    } else {
      console.error("Error memperbarui ujian:", data.error);
    }
  } catch (error) {
    console.error("Terjadi kesalahan saat memperbarui ujian:", error);
  }
};

const Exam = () => {
  const { examid } = useParams();
  const { getUser } = useContext(AuthContext);
  const auth = getUser();
  const navigate = useNavigate();
  const [examData, setExamData] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [packageData, setPackageData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [ended, setEnded] = useState(false);
  const [timer, setTimer] = useState(0);
  const {isOpen, onOpen, onOpenChange} = useDisclosure();

  const handleAnswerChange = (questionId, selectedLetter) => {
    setAnswers((prevAnswers) => {
      const existingAnswer = prevAnswers.find(
        (a) => a.question_id === questionId
      );

      const updatedAnswers = existingAnswer
        ? prevAnswers.map((a) =>
            a.question_id === questionId ? { ...a, answer: selectedLetter } : a
          )
        : [...prevAnswers, { question_id: questionId, answer: selectedLetter }];

      // Simpan data ke localStorage
      localStorage.setItem("answers", JSON.stringify(updatedAnswers));

      return updatedAnswers;
    });
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleFinish = async () => {
    const score = await calculateScore(packageData.id, answers); // Menghitung skor
    console.log("Exam ID:", examid); // Menampilkan exam ID
    console.log("Score:", score); // Menampilkan skor

    // Mengupdate state examData dengan skor yang baru
    setExamData((prevData) => ({
      ...prevData,
      score: score, // Memasukkan skor ke dalam state examData
    }));

    localStorage.removeItem("answers");
    localStorage.removeItem("timer");

    const updatedExam = await updateExam(examid, score);
    console.log("Ujian berhasil diperbarui:", updatedExam);

    setEnded(true);
  };

  const fetchRemainingTime = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/exams/${examid}/remaining-time`
      );
      const data = await response.json();
      if (response.ok) {
        const remainingTime = data.remaining_time;

        // Gunakan regex untuk mengekstrak menit dan detik
        const timeRegex = /(\d+)m(\d+\.\d+)s/;
        const match = remainingTime.match(timeRegex);

        if (match) {
          const minutes = parseInt(match[1], 10); // Ekstrak menit
          const seconds = parseInt(match[2], 10);

          // Menghitung total detik
          const totalSeconds = minutes * 60 + seconds;

          // Set timer dengan total detik
          setTimer(totalSeconds);
        } else {
          console.error("Format waktu tidak sesuai:", remainingTime);
        }
      } else {
        console.error("Failed to fetch remaining time", data.error);
      }
    } catch (error) {
      console.error("Error fetching remaining time", error);
    }
  };

  const fetchExamData = async () => {
    try {
      const response = await fetch(`http://localhost:8080/exams/${examid}`);
      const data = await response.json();
      if (response.ok) {
        console.log("Data yang diterima:", data);
        setExamData(data.exam);
        setQuestions(data.questions);
        setPackageData(data.packet);
      } else {
        console.error("Failed to fetch exam data", data.error);
      }
    } catch (error) {
      console.error("Error fetching exam data", error);
    } finally {
      setLoading(false); // Update loading state setelah data diambil
    }
  };

  useEffect(() => {
    if (!auth) {
      navigate("/login-or-register");
      return;
    }

    fetchExamData();
  }, [examid, auth, navigate]);

  useEffect(() => {
    if (examData) {
      console.log("exam status =", examData);
      if (examData.status === 1) {
        setEnded(true); // Jika status = 1, ujian sudah selesai
      } else {
        setEnded(false); // Jika status = 0, ujian belum selesai
        fetchRemainingTime(); // Ambil remaining time jika ujian belum selesai
      }

      if (examData && examData.user_id !== auth) {
        navigate("/error", {
          state: {
            message: "Anda tidak memiliki akses ke ujian ini.",
            statusText: "403 Forbidden",
          },
        });
      }
    }
  }, [examData, auth, navigate]);

  useEffect(() => {
    if (packageData?.duration_exam && !ended) {
      console.log(timer);
      const interval = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer <= 1) {
            clearInterval(interval); // Menghentikan timer ketika waktu habis
            setEnded(true); // Set ended menjadi true, ujian selesai
            handleFinish(); // Panggil handleFinish saat waktu habis
            return 0;
          }

          return prevTimer - 1;
        });
      }, 1000); // Mengurangi timer setiap detik

      return () => clearInterval(interval);
    }
  }, [packageData, ended]);

  useEffect(() => {
    // Periksa jika ada data yang tersimpan di localStorage
    const storedAnswers = localStorage.getItem("answers");
    if (storedAnswers) {
      setAnswers(JSON.parse(storedAnswers));
    }

    // Ambil timer dari localStorage jika ada
    const storedTimer = localStorage.getItem("timer");
    if (storedTimer) {
      setTimer(JSON.parse(storedTimer));
    }
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Peringantan</ModalHeader>
              <ModalBody>
                <p>
                  Apakah anda sudah yakin untuk menyelesaikan exam?
                </p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Batal
                </Button>
                <Button color="primary" onPress={onClose} onClick={handleFinish}>
                  Ya, saya yakin
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <div className="exam flex felx-row w-full h-full">
        <section className="exam-description h-full">
          <Card className="min-w-[250px] h-full overflow-hidden" radius="none">
            <CardHeader className="flex gap-3 flex-col px-10">
              <Image alt="asnesia logo" radius="none" src={Brand} width={175} />
            </CardHeader>
            <CardBody className="pt-10 ps-10 flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <p className="text-asnesia-blue">Exam ID</p>
                <p className="text-xl">{examData.ID}</p>
                <Divider />
              </div>

              <div className="flex flex-col gap-2">
                <p className="text-asnesia-blue">Durasi Total</p>
                <p className="text-xl">
                  {formatDuration(packageData.duration_exam)}
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <p className="text-asnesia-blue">Exercise Resume</p>
                <p className="flex justify-between">
                  <span>total pertanyaan</span>{" "}
                  <span className="text-xl">{questions.length}</span>
                </p>
                <Divider />
                <p className="flex gap-2">
                  <span className="text-green-500 me-2 border-[1px] border-white">
                    <FontAwesomeIcon icon={faCircle} />
                  </span>
                  Answered
                </p>
                <p className="flex gap-2">
                  <span className="me-2">
                    <FontAwesomeIcon
                      className="border-[1px] border-black rounded-full text-white"
                      icon={faCircle}
                    />
                  </span>
                  Not Answered
                </p>
              </div>
            </CardBody>
          </Card>
        </section>
        <section className="exam-question w-full overflow-y-auto">
          <div className="flex exam-question-header p-5 flex items-center bg-asnesia-darkblue w-full text-white justify-between">
            <div className="exam-question-title text-2xl font-semibold ms-5">
              Paket
            </div>
            <div className="time-remaining">
              <div className="flex flex-col">
                <p className="text-md text-default-500">Time Remaining</p>
                <p className="text-xl font-semibold">
                  {ended ? formatDuration(timer) : formatDuration(timer)}
                </p>
              </div>
            </div>
          </div>

          <div className="question-body p-10">
            {ended ? (
              // Jika ujian sudah selesai, tampilkan skor
              <Card>
                <CardBody className="flex justify-center text-center">
                  <p className="text-xl font-semibold">Skor Anda:</p>
                  <p className="text-2xl mb-10">{examData.score}</p>
                  <Button
                    color="warning"
                    variant="ghost"
                    size="lg"
                    className="px-5 self-center"
                    onPress={() => {navigate(`/service-puscharge/view/${examData.order_id}`)}}
                  >
                    Kembali
                  </Button>
                </CardBody>
              </Card>
            ) : (
              currentQuestion && (
                <Card key={currentQuestion.id} className="mb-4">
                  <CardBody className="p-10">
                    <p className="mb-5">{currentQuestion.question}</p>

                    <RadioGroup
                      label="Select your Answer"
                      defaultValue=""
                      value={
                        answers.find(
                          (answer) => answer.question_id === currentQuestion.id
                        )?.answer
                      }
                      onChange={(e) => {
                        // Mengambil nilai yang dipilih (huruf seperti 'A', 'B', dll.)
                        const selectedLetter = e.target.value;
                        handleAnswerChange(currentQuestion.id, selectedLetter);
                      }}
                    >
                      {currentQuestion.answer.map((text, index) => (
                        <Radio
                          key={index}
                          value={String.fromCharCode(65 + index)}
                        >
                          {text}
                        </Radio>
                      ))}
                    </RadioGroup>
                  </CardBody>
                </Card>
              )
            )}
          </div>
        </section>
        <section className="exam-numberofquestion ">
          <Card className="min-w-[350px] h-full overflow-hidden" radius="none">
            <CardBody className="pt-10 px-10">
              <div className="flex gap-3 mb-5">
                <p className="flex gap-2">
                  <span className="text-green-500 me-2 border-[1px] border-white">
                    <FontAwesomeIcon icon={faCircle} />
                  </span>
                  Answered
                </p>
                <p className="flex gap-2">
                  <span className="me-2">
                    <FontAwesomeIcon
                      className="border-[1px] border-black rounded-full text-white"
                      icon={faCircle}
                    />
                  </span>
                  Not Answered
                </p>
              </div>

              <div className="questions-number">
                <p className="text-asnesia-blue font-semibold text-xl mb-3">
                  Question Section
                </p>
                <div className="question-number-numbers grid grid-cols-5 gap-4 overflow-y-auto">
                  {questions.map((question, index) => {
                    // Memeriksa apakah soal sudah dijawab
                    const answer = answers.find(
                      (a) => a.question_id === question.id
                    ); // Mencari jawaban untuk soal ini
                    const isAnswered = answer ? true : false; // Menandakan apakah soal sudah dijawab

                    return (
                      <Button
                        color={isAnswered ? "success" : "default"}
                        key={index}
                        size="sm"
                        isDisabled={ended}
                        className={`p-5 ${
                          index === currentQuestionIndex
                            ? "border-2 border-asnesia-blue"
                            : ""
                        }`} // Memberikan highlight jika soal sudah dijawab
                        onPress={() => setCurrentQuestionIndex(index)} // Menavigasi ke soal yang dipilih
                      >
                        {index + 1}
                      </Button>
                    );
                  })}
                </div>
              </div>

              <div className="finish-button mt-auto mb-10 ms-auto me-10">
                <Button
                  isDisabled={ended}
                  color="primary"
                  size="lg"
                  onPress={onOpen}
                >
                  Finish Exam?
                </Button>
              </div>
            </CardBody>
          </Card>
        </section>
      </div>

      <div className="footer flex py-5 mt-auto bg-asnesia-darkblue w-full">
        <div className="flex gap-3 w-full justify-center items-center">
          {currentQuestionIndex > 0 && (
            <Button
              color="warning"
              variant="ghost"
              size="lg"
              className="px-5 self-center"
              onPress={goToPreviousQuestion}
              isDisabled={ended} // Menonaktifkan tombol jika ujian sudah selesai
            >
              Sebelumnya
            </Button>
          )}

          {currentQuestionIndex < questions.length - 1 && (
            <Button
              color="warning"
              size="lg"
              className="px-5 self-center"
              onPress={goToNextQuestion}
              isDisabled={ended} // Menonaktifkan tombol jika ujian sudah selesai
            >
              Selanjutnya
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Exam;
