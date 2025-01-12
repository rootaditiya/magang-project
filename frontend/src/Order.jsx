import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import CardContent from "./component/CardContent";
import { Button, Card, CardBody, Chip } from "@nextui-org/react";
import { AuthContext } from "./main";

const Order = () => {
  const [orders, setOrders] = useState(null); // State untuk menyimpan data exam
  const [loading, setLoading] = useState(true);
  const { getUser } = useContext(AuthContext);
  const auth = getUser();
  const navigate = useNavigate();

  useEffect(() => {
    const userID = auth; // Ganti dengan ID pengguna yang sesuai
    let interval;

    const fetchOrder = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/orders/user/${userID}`
        );
        const data = await response.json();
        if (data === null || data.length === 0) {
          setOrders(null);
        } else {
          setOrders(data);
        }
      } catch (error) {
        console.error("Error fetching exam data:", error);
        setOrders(null); // Jika terjadi error, anggap data kosong
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();

    interval = setInterval(() => {
      fetchOrder();
    }, 3000);

    return () => clearInterval(interval);
  }, [auth, navigate]);

  if (loading) {
    return <div>Loading...</div>; // Menampilkan loading saat data sedang diambil
  }

  return (
    <div className="flex flex-col gap-8">
      <section className="my-packages flex flex-col gap-5">
        {orders === null ? (
          <CardContent /> // Jika tidak ada data ujian, tampilkan CardContent
        ) : (
          orders.map((order, index) => (
            <div key={index} className="exam-card">
              {/* Render kartu ujian sesuai dengan data exam */}
              <Card>
                <CardBody className="p-10">
                  <div className="exams flex gap-10 w-full">
                    <div className="exam-score">
                      <Button
                        variant="ghost"
                        size="lg"
                        color="primary"
                        onPress={() => {
                          navigate(`/service-puscharge/view/${order.order.ID}`);
                        }}
                      >
                        Lihat Packet
                      </Button>
                    </div>
                    <div className="flex justify-between w-full">
                      <div className="exam-details">
                        <h2 className="text-2xl font-semibold">
                          {order.packet.NamePacket}
                        </h2>
                        <p>{order.packet.Description}</p>
                        {order.order.Status && order.order.Status === 1 ? (
                          <small className="text-green-500">success</small>
                        ) : (
                          <small className="text-yellow-500">pending</small>
                        )}
                        <small></small>
                      </div>
                      <div className="harga text-xl font-semibold">
                        Rp. {order.order.Amount}
                      </div>
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

export default Order;
