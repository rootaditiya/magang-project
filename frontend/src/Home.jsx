import { Image } from "@nextui-org/react";
import HeroImage from "./assets/HeroImage.svg";
import BrandImage from "./assets/brand.svg";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router";
import { AuthContext } from "./main";

const Home = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const { getUser } = useContext(AuthContext);
  const auth = getUser();

  useEffect(() => {
    const loadData = async () => {
      if (auth) {
        console.log("aut = ", auth)
        try {
          const response = await fetch(
            `http://localhost:8080/users/${auth}`
          ); // Ganti URL API dengan yang sesuai
          if (!response.ok) {
            throw new Error("Failed to fetch user data");
          }
          const userData = await response.json();
          setUser(userData);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
      setIsLoading(false);
    };

    loadData();
  }, [auth]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center bg-gray-100 h-screen">
      {/* Header */}
      <header className="w-full bg-white shadow-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center py-4 px-6">
          <Link to="/">
            <Image src={BrandImage} height={40} />
          </Link>
          <nav>
            <ul className="flex space-x-6">
              <li>
                <Link to="#layanan" className="text-gray-600 hover:text-black">
                  Layanan
                </Link>
              </li>
              <li>
                <Link to="#ulasan" className="text-gray-600 hover:text-black">
                  Ulasan
                </Link>
              </li>
              <li>
                <Link to="#faq" className="text-gray-600 hover:text-black">
                  FAQ
                </Link>
              </li>
            </ul>
          </nav>

          {auth ? (
            <Link to="/dashboard">
              <button className="text-lg font-bold px-5 py-3 py-2 rounded-xl bg-asnesia-yellow hover:bg-asnesia-darkblue hover:text-asnesia-yellow transition">
                {user ? user.name : "Masuk"}
              </button>
            </Link>
          ) : (
            <Link to="/login-or-register">
              <button className="text-lg font-bold px-5 py-3 py-2 rounded-xl bg-asnesia-yellow hover:bg-asnesia-darkblue hover:text-asnesia-yellow transition">
                Masuk
              </button>
            </Link>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex flex-col lg:flex-row items-center justify-between py-12 px-4 text-center lg:text-left max-w-7xl mx-auto h-screen">
        {/* Text Section */}
        <div className="flex flex-col items-center lg:items-start mb-8 lg:mb-0 lg:w-2/3">
          <h2 className="text-6xl font-bold text-gray-800 mb-4">
            Solusi Digital Belajar Test CPNS
          </h2>
          <p className="text-gray-600 mb-6 text-xl font-thin">
            Hai! Apakah kamu sedang mempersiapkan diri untuk tes CPNS? Mau
            belajar, tapi bingung mau mulai dari mana? Mau tahu tips dan trik
            jawab soal dengan cepat?
          </p>
          <p className="text-xl mb-8 font-thin">
            <span className="font-bold me-2">ASNesia Solusinya!</span>Sebuah
            platform belajar tes CPNS kapan saja dan dimana aja!
          </p>
          <Link to={auth ? "/dashboard" : "/login-or-register"}>
            <button className="text-lg font-bold px-5 py-3 py-2 rounded-xl bg-asnesia-yellow hover:bg-asnesia-darkblue hover:text-asnesia-yellow transition">
              Coba sekarang
            </button>
          </Link>
        </div>

        {/* Image Section */}
        <div className="lg:w-1/3 flex justify-center ml-auto">
          <img
            src={HeroImage}
            alt="Platform Preview"
            className="rounded-lg shadow-lg"
          />
        </div>
      </main>

      {/* Footer */}
      {/* <footer className="w-full bg-white mt-auto shadow-md py-4">
      <p className="text-center text-gray-500">© 2025 ASNesia. All rights reserved.</p>
    </footer> */}
    </div>
  );
};

export default Home;
