import PropTypes from 'prop-types';

const Dashboard = ({children}) => {
  return (
    <div>
      Dashboard
      {children}
    </div>
  )
}

Dashboard.propTypes = {
  children: PropTypes.node
};

export default Dashboard
