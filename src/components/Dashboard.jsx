import { filterData, apiURL } from '../data';
import './Dashboard.css';
import FilterButton from './FilterButton';
import Spinner from './Spinner';
import Courses from './Courses';

const Dashboard = ({ courses, category, setCategory, loading, error }) => {
  return (
    <main className='main-content'>
      <FilterButton
        filterData={filterData}
        category={category}
        setCategory={setCategory}
      />

      {loading ? (
        <div className="dashboard-container">
          <h2>Welcome to StudyNotion!</h2>
          <Spinner />
        </div>
      ) : error ? (
        <div className='status-message-container error-state'>
          <div className='status-icon'>⚠️</div>
          <h3 className='status-title'>Unable to Load Courses</h3>
          <p className='status-desc'>
            We encountered an issue fetching course data from the server. Please verify your connection and try again.
          </p>
          <button className='retry-btn' onClick={fetchData}>
            🔄 Try Again
          </button>
        </div>
      ) : (
        <Courses courses={courses} category={category} />
      )}
    </main>
  )
}

export default Dashboard
