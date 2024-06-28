import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import JobCard from "./JobCard";

export default function TabCatogery({ jobs }) {

  return (
    <Tabs>
      <div className="container p-6 mx-auto bg-green-200">
        <h2 className="text-2xl md:text-5xl text-center font-bold p-6">Brows jobs by categories</h2>
        <p className='max-w-2xl mx-auto my-6 text-center text-gray-500 '>
          Three categories available for the time being. They are Web
          Development, Graphics Design and Digital Marketing. Browse them by clicking on the tabs below.
        </p>
        <div className="flex items-center justify-center mt-4">
          <TabList>
            <Tab>Web Development</Tab>
            <Tab>Graphic Design</Tab>
            <Tab>Digital Marketing</Tab>
          </TabList>
          </div>
          <TabPanel>
            <div className="mt-6 md:mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap:6">
            {jobs.filter(j=> j.category === 'Web Development').map(job => (
              <JobCard job={job} key={job._id} />
            ))}
            </div>
          </TabPanel>
          <TabPanel>
          <div className="mt-6 md:mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap:6">
            {jobs.filter(j=> j.category === 'Graphic Design').map(job => (
              <JobCard job={job} key={job._id} />
            ))}
            </div>
          </TabPanel>
          <TabPanel>
          <div className="mt-6 md:mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap:6">
            {jobs.filter(j=> j.category === 'Digital Marketing').map(job => (
              <JobCard job={job} key={job._id} />
            ))}
            </div>
          </TabPanel>
        
      </div>
    </Tabs>
  );
}
