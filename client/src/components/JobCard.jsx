/* eslint-disable react/prop-types */

import { Link } from 'react-router-dom'

const   JobCard = ({ job }) => {
  const {
    _id,
    job_title,
    description,
    min_price,
    max_price,
    category,
    deadline,
  } = job || {}
  
  return (
    <Link
      to={`/job/${_id}`}
      className='w-full mb-6 max-w-sm px-6 py-8 bg-white rounded-md shadow-md hover:scale-[1.05] transition-all'
    >
      <div className='flex items-center justify-between p-4'>
        <span className='text-xs font-light text-gray-800 '>
          Deadline: {new Date(deadline).toLocaleDateString()}
        </span>
        <span className='px-3 py-3 text-[10px] text-blue-800 uppercase bg-blue-200 rounded-full '>
          {category}
        </span>
      </div>

      <div>
        <h1 className='mt-2 text-lg font-semibold text-gray-800 '>
          {job_title}
        </h1>
      {/* title for hover and show description, .substring for  */}
        <p title={description} className='mt-2 text-sm text-gray-600 '>
          {description.substring(0, 70)}...
        </p> 
        <p className='mt-2 text-sm font-bold text-gray-600 '>
          Range: ${min_price} - ${max_price}
        </p>
      </div>
    </Link>
  )
}

export default JobCard