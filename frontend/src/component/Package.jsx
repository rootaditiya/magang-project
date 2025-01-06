import PropTypes from "prop-types";
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
} from "@nextui-org/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";

const Package = ({
  children,
  packageName,
  packageDescription,
  packagePrice,
}) => {
  return (
    <Card className="max-w-[400px] p-7 min-h-72">
      <CardHeader className="flex gap-3 items-centers justify-center">
        <div className="flex flex-col text-center ">
          <p className="text-2xl font-bold">{packageName}</p>
        </div>
      </CardHeader>
      <Divider />
      <CardBody className="text-md py-5 flex flex-col justify-center">
        <p>
          <span className="flex gap-3 items-center">
            <FontAwesomeIcon icon={faCircleCheck} /> {packageDescription}
          </span>
        </p>
      </CardBody>
      <Divider />
      <CardFooter>
        <div className="flex justify-between items-center w-full">
          {packagePrice ? <div className="text-xl font-semibold">Rp. {packagePrice}</div> : ""}
          <div className="ml-auto mr-0">{children}</div>
        </div>
      </CardFooter>
    </Card>
  );
};

Package.propTypes = {
  packageName: PropTypes.string.isRequired,
  packageDescription: PropTypes.string.isRequired,
  packagePrice: PropTypes.number,
  children: PropTypes.node,
};

export default Package;
