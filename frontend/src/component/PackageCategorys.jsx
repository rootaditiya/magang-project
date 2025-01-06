import { Button } from "@nextui-org/react";
import { useState } from "react";

const PackageCategorys = () => {
  const [category, setCategory] = useState("belajar-mandiri");

  return (
    <div className="flex gap-5">
      <Button
        onPress={() => {
          setCategory("belajar-mandiri");
        }}
        color="default"
        size="lg"
        className={`${
          category === "belajar-mandiri"
            ? "bg-asnesia-darkblue text-asnesia-yellow"
            : ""
        } font-semibold`}
      >
        Belajar Mandiri
      </Button>

      <Button
        onPress={() => {
          setCategory("kelas-intensif");
        }}
        color="default"
        size="lg"
        className={`${
          category === "kelas-intensif"
            ? "bg-asnesia-darkblue text-asnesia-yellow"
            : ""
        } font-semibold`}
      >
        Kelas Intensif
      </Button>

      <Button
        onPress={() => {
          setCategory("gratis");
        }}
        color="default"
        size="lg"
        className={`${
          category === "gratis"
            ? "bg-asnesia-darkblue text-asnesia-yellow"
            : ""
        } font-semibold`}
      >
        Gratis
      </Button>
    </div>
  );
};

export default PackageCategorys;
