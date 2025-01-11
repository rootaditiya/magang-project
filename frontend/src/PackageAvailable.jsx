import PropTypes from 'prop-types'
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@nextui-org/react";
import PackageCategorys from "./component/PackageCategorys";
import PackagesList from "./component/PackagesList";
import { useContext, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileZipper } from "@fortawesome/free-solid-svg-icons";
import Package from "./component/Package";
import { AuthContext } from './main';
import { useNavigate } from 'react-router';

const getCurrentDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = (today.getMonth() + 1).toString().padStart(2, '0'); // Menambahkan leading zero jika bulan kurang dari 10
  const day = today.getDate().toString().padStart(2, '0'); // Menambahkan leading zero jika tanggal kurang dari 10  
  return `${year}-${month}-${day}`;
};


const PackageAvailable = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [packages, setPackages] = useState([]);
  const [selectedPackages, setSelectedPackages] = useState({});
  const {auth } = useContext(AuthContext);
  const navigate = useNavigate();


  const handleBeli = (paket, user) => {
    console.log(paket, user);
    fetch("http://localhost:8080/orders", {
      method: "POST",  // Menentukan metode yang digunakan adalah POST
      headers: {
        "Content-Type": "application/json",  // Menyatakan bahwa data yang dikirim dalam format JSON
      },
      body: JSON.stringify({
        id_user: user,
        id_packet: paket,
        payment_status: 2,
        order_date: getCurrentDate(),
        total_price: 1000,
      }),
    })
      .then((response) => {
        // Mengecek apakah respons berhasil
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        console.log(response)
        return response.json();  // Mengambil data dalam format JSON dari respons
      })
      .then((data) => {
        console.log(data);  // Menampilkan data respons dari server
        alert("Payment success");
        navigate("/service-puscharge");
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };

  useEffect(() => {
    fetch("http://localhost:8080/packets")
      .then((response) => {
        // Periksa jika respons berhasil
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json(); // Mengambil data dalam format JSON
      })
      .then((data) => {
        console.log(data); // Menampilkan data yang diterima
        setPackages(data); // Mengupdate state dengan data yang diterima
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  }, []);

  return (
    <>
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <h2 className="text-xl font-semibold">Pembelian</h2>
              </ModalHeader>
              <ModalBody>
                <span className="flex text-2xl font-medium gap-5 items-center">
                  <FontAwesomeIcon icon={faFileZipper} />
                  {selectedPackages.NamePacket}
                </span>
              </ModalBody>
              <ModalFooter>
                <div className="flex flex-col w-full gap-5">
                  <div className="flex text-xl font-medium justify-between">
                    <span>total</span> <span>{selectedPackages.Price}</span>
                  </div>
                  <Button
                    color="primary"
                    onPress={onClose}
                    onClick={() => {
                      handleBeli(selectedPackages.ID, auth);
                    }}
                  >
                    <span className="text-lg font-semibold">Beli Sekarang</span>
                  </Button>
                </div>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <div className="flex flex-col gap-8">
        <section className="category flex gap-5">
          <PackageCategorys />
        </section>

        <section className="packages-list ">
          <PackagesList>
          {packages.map((pack, index) => {
              return (
                <Package
                  key={index}
                  packageName={pack.NamePacket}
                  packageDescription={pack.Description}
                  packagePrice={pack.Price}
                >
                  <Button
                    onPress={onOpen}
                    onClick={() => setSelectedPackages(pack)}
                    className="bg-asnesia-yellow text-lg font-bold text-asnesia-darkblue px-8 py-6"
                  >
                    Beli
                  </Button>
                </Package>
              );
            })}

          </PackagesList>
        </section>
      </div>
    </>
  );
};

PackageAvailable.propTypes = {
  user: PropTypes.object
}

export default PackageAvailable;
