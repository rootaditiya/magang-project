import PropTypes from "prop-types";
import { Button } from "@nextui-org/react";
import CardContent from "./component/CardContent";
import { useContext, useEffect, useState } from "react";
import PackagesList from "./component/PackagesList";
import Package from "./component/Package";
import { AuthContext } from "./main";
import { useNavigate } from "react-router";

const MyPackage = () => {
  const [category, setCategory] = useState("pppk");
  const [packages, setPackages] = useState([]);
  const navigate = useNavigate();

  const { getUser } = useContext(AuthContext);
  const auth = getUser();

  useEffect(() => {
    let interval;

    const fetchPackages = async () => {
      try {
        const response = await fetch(`http://localhost:8080/packets-purchased/${auth}`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setPackages(data); // Update state dengan data terbaru
      } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
      }
    };

    fetchPackages();

    interval = setInterval(() => {
      fetchPackages();
    }, 3000);

    return () => clearInterval(interval);
  }, [auth]); // Menambahkan dependensi user.id agar effect dijalankan saat user.id berubah

  return (
    <div className="flex flex-col gap-8">
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

      <section className="my-packages ">
        {/* {if(!packages)} */}
        {Array.isArray(packages) && packages.length > 0 ? (
          <PackagesList>
            {packages.map((pack, index) => {
              return (
                <Package
                  baru={index===0}
                  key={index}
                  packageName={pack.packet.NamePacket}
                  packageDescription={pack.packet.Description}
                  // packagePrice={pack.Price}
                >
                  <Button
                    className="bg-asnesia-yellow text-lg font-bold text-asnesia-darkblue px-8 py-6"
                    onPress={() => {
                      navigate(`/service-puscharge/view/${pack.order_id}`);
                    }}
                  >
                    Lihat
                  </Button>
                </Package>
              );
            })}
          </PackagesList>
        ) : (
          <CardContent />
        )}
      </section>
    </div>
  );
};

MyPackage.propTypes = {
  user: PropTypes.object,
};

export default MyPackage;
