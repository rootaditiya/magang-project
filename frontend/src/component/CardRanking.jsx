import PropTypes from "prop-types";
import { Card, CardBody, CardHeader, Divider, Image } from "@nextui-org/react"

const CardRanking = ({description, logo, ranking}) => {
  return (
    <Card className="w-1/3 h-40 p-3">
      <CardHeader className="flex gap-3">
        <Image
          alt="nextui logo"
          height={40}
          radius="sm"
          src={logo}
          width={40}
        />
        <div className="flex flex-col">
          <p className="text-md font-semibold">Ranking</p>
          <p className="text-small text-default-500">{ranking}</p>
        </div>
      </CardHeader>
      <Divider />
      <CardBody>
        <p>{description}</p>
      </CardBody>
      
    </Card>
  )
}

CardRanking.propTypes = {
    description: PropTypes.string,
    logo: PropTypes.string,
    ranking: PropTypes.string,
}

export default CardRanking
