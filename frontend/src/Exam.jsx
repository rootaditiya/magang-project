import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Image,
  Radio,
  RadioGroup,
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
  const { auth } = useContext(AuthContext);
  // const auth = useState(getUser());
  const navigate = useNavigate();
  const [examData, setExamData] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [packageData, setPackageData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [ended, setEnded] = useState(false);
  const [timer, setTimer] = useState(0);

  const handleAnswerChange = (questionId, selectedLetter) => {
    console.log("questionId:", questionId);
    console.log("selectedLetter:", selectedLetter);

    setAnswers((prevAnswers) => {
      const existingAnswer = prevAnswers.find(
        (a) => a.question_id === questionId
      );

      console.log("Existing answers:", prevAnswers);
      console.log("Existing answer found:", existingAnswer);

      if (existingAnswer) {
        // Update the existing answer
        const updatedAnswers = prevAnswers.map((a) =>
          a.question_id === questionId ? { ...a, answer: selectedLetter } : a
        );

        console.log("Updated answers:", updatedAnswers);

        return updatedAnswers;
      } else {
        // Add a new answer
        const newAnswers = [
          ...prevAnswers,
          { question_id: questionId, answer: selectedLetter },
        ];

        console.log("New answers added:", newAnswers);

        return newAnswers;
      }
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

    const updatedExam = await updateExam(examid, score);
    console.log("Ujian berhasil diperbarui:", updatedExam);
    setEnded(true);
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
    if (packageData?.duration_exam) {
      // Set timer berdasarkan duration_exam dari packageData
      setTimer(packageData.duration_exam);

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

      // Hapus interval ketika komponen di-unmount atau ketika timer habis
      return () => clearInterval(interval);
    }
  }, [packageData]);

  if (loading) {
    return <div>Loading...</div>;
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="flex flex-col h-screen">
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
                <CardBody>
                  <p className="text-xl font-semibold">Skor Anda:</p>
                  <p className="text-2xl">{examData.score}</p>
                </CardBody>
              </Card>
            ) : (
              currentQuestion && (
                <Card key={currentQuestion.id} className="mb-4">
                  <CardBody className="p-10">
                    <p className="mb-5">{currentQuestion.question}</p>

                    <RadioGroup
                      label="Select your Answer"
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
                <Button color="primary" size="lg" onPress={handleFinish}>
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
              disabled={ended} // Menonaktifkan tombol jika ujian sudah selesai
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
              disabled={ended} // Menonaktifkan tombol jika ujian sudah selesai
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
