import { useEffect, useState } from "react";
import useAxiosSecure from "../hooks/useAxiosSecure";
import JobCard from "../components/JobCard";

const AllJobs = () => {
  // eslint-disable-next-line no-unused-vars
  const [itemPerPage, setItemPerPage] = useState(3);
  const [currentPage, setCurrentPage] = useState(1);
  const [count, setCount] = useState(0);
  const [filter, setFilter] = useState('');
  const [sort, setSort] = useState('');
  const [search, setSearch] = useState('');
  const [searchText, setSearchText] = useState('');
  const [jobs, setJobs] = useState([]);
  const axiosSecure = useAxiosSecure();
  // another way to fetch data from api
  useEffect(() => {
    //use effect doesn't directly access async functions
    const getData = async () => {
      // so additional function is created
      const { data } = await axiosSecure(
        `/all-jobs?page=${currentPage}&size=${itemPerPage}&filter=${filter}&sort=${sort}&search=${search}`
      );// all sort and search are sent to the server by above api route
      setJobs(data); // to get data without props axios is used and jobs data is set
    };
    getData(); // additional function is called
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, itemPerPage, filter, sort, search]);

  useEffect(() => {
    //use effect doesn't directly access async functions
    const getCount = async () => {
      const { data } = await axiosSecure(`/jobs-count?filter=${filter}&search=${search}`);
      setCount(data.count);
    };
    getCount(); // additional function is called
  }, [axiosSecure, filter, search]);
  console.log(count);
  const numberOfpages = Math.ceil(count / itemPerPage);
  const pages = [...Array(numberOfpages).keys()].map((el) => el + 1);
  // handlePaginationButton
  const handlePaginationButton = (value) => {
    // console.log(value)
    setCurrentPage(value);
  };
  const handleReset = ()=>{
    // setCurrentPage(1);
    setFilter('');
    setSort('');
    setSearch('');
    setSearchText('');
  }
  const handleSearch = (e) => {
    e.preventDefault();
    // const text = e.target.search.value;
    setSearch(searchText);
  };
  return (
    <div className="container px-6 py-10 mx-auto min-h-[calc(100vh-306px)] flex flex-col justify-between bg-green-200">
        <div className="flex flex-col md:flex-row justify-center items-center gap-5 ">
          <div>
            <select
              onChange={(e) => {
                setFilter(e.target.value);
                setCurrentPage(1);
              }}
              value={filter}
              name="category"
              id="category"
              className="border p-4 rounded-lg"
            >
              <option value="">Filter By Category</option>
              <option value="Web Development">Web Development</option>
              <option value="Graphics Design">Graphics Design</option>
              <option value="Digital Marketing">Digital Marketing</option>
            </select>
          </div>

          <form onSubmit={handleSearch}>
            <div className="flex p-1 overflow-hidden border rounded-lg    focus-within:ring focus-within:ring-opacity-40 focus-within:border-blue-400 focus-within:ring-blue-300">
              <input
              onChange={(e)=>setSearchText(e.target.value)}
              value={searchText}
                className="px-6 py-2 text-gray-700 placeholder-gray-500 bg-white outline-none focus:placeholder-transparent"
                type="text"
                name="search"
                placeholder="Enter Job Title"
                aria-label="Enter Job Title"
              />

              <button className="px-1 md:px-4 py-3 text-sm font-medium tracking-wider text-gray-100 uppercase transition-colors duration-300 transform bg-gray-700 rounded-md hover:bg-gray-600 focus:bg-gray-600 focus:outline-none">
                Search
              </button>
            </div>
          </form>
          <div>
            <select
              onChange={e => {
                setSort(e.target.value);
                setCurrentPage(1);
              }}
              value={sort}
              name="sort"
              id="sort"
              className="border p-4 rounded-md"
            >
              <option value="">Sort By Deadline</option>
              <option value="dsc">Descending Order</option>
              <option value="asc">Ascending Order</option>
            </select>
          </div>
          <button onClick={handleReset} className="btn">Reset</button>
        </div>
        <div className="grid grid-cols-1 gap-8 mt-8 xl:mt-16 md:grid-cols-2  xl:grid-cols-3">
          {jobs.map((job) => (
            <JobCard key={job._id} job={job} />
          ))}
        </div>
      {/* previous button */}
      <div className="flex justify-center mt-12">
        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage ===1}
          className="px-4 py-2 mx-1 text-gray-700 disabled:text-gray-500 capitalize bg-gray-200 rounded-md disabled:cursor-not-allowed disabled:hover:bg-gray-200 disabled:hover:text-gray-500 hover:bg-blue-500  hover:text-white"
        >
          <div className="flex items-center -mx-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 mx-1 rtl:-scale-x-100"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M7 16l-4-4m0 0l4-4m-4 4h18"
              />
            </svg>

            <span className="mx-1">previous</span>
          </div>
        </button>
        {/* pagination part */}
        {pages.map((btnNum) => (
          <button
            onClick={() => handlePaginationButton(btnNum)}
            key={btnNum}
            className={`hidden ${
              currentPage === btnNum ? "bg-blue-500 text-white" : ""
            } px-4 py-2 mx-1 transition-colors duration-300 transform  rounded-md sm:inline hover:bg-blue-500  hover:text-white`}
          >
            {btnNum}
          </button>
        ))}
        {/* Next button */}
        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === numberOfpages}
          className="px-4 py-2 mx-1 text-gray-700 transition-colors duration-300 transform bg-gray-200 rounded-md hover:bg-blue-500 disabled:hover:bg-gray-200 disabled:hover:text-gray-500 hover:text-white disabled:cursor-not-allowed disabled:text-gray-500"
        >
          <div className="flex items-center -mx-1">
            <span className="mx-1">Next</span>

            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 mx-1 rtl:-scale-x-100"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </div>
        </button>
      </div>
    </div>
  );
};

export default AllJobs;
