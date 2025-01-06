import PropTypes from "prop-types";

const PackagesList = ({children}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">     
      {children}
    </div>
  )
}

PackagesList.propTypes = {
  children: PropTypes.node,
}

export default PackagesList
