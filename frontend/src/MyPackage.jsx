import PropTypes from 'prop-types'
import { Button } from "@nextui-org/react";
import CardContent from "./component/CardContent";
import { useEffect, useState } from "react";
import PackagesList from "./component/PackagesList";
import Package from "./component/Package";

const MyPackage = ({ user }) => {
  const [category, setCategory] = useState("pppk");
  const [packages, setPackages] = useState([]);

  useEffect(() => {
    // Pastikan URL digabungkan dengan benar
    fetch(`http://localhost:8080/packets-purchased/${user.id}`)
      .then((response) => {
        // Memeriksa jika respons berhasil
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json(); // Mengonversi respons menjadi JSON
      })
      .then((data) => {
        console.log(data); // Menampilkan data yang diterima
        setPackages(data); // Mengupdate state dengan data yang diterima
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  }, [user]); // Menambahkan dependensi user.id agar effect dijalankan saat user.id berubah

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
                  key={index}
                  packageName={pack.NamePacket}
                  packageDescription={pack.Description}
                  // packagePrice={pack.Price}
                >
                  <Button className="bg-asnesia-yellow text-lg font-bold text-asnesia-darkblue px-8 py-6">
                    Lihat
                  </Button>
                </Package>
              );
            })}
          </PackagesList>
        ) : (
          <CardContent/>
        )}
      </section>
    </div>
  );
};

MyPackage.propTypes = {
  user: PropTypes.object,
}

export default MyPackage;
