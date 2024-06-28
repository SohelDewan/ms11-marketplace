import { useLoaderData } from "react-router-dom";
import Carousel from "../components/Carousel";
import TabCatogery from "../components/TabCatogery";

export default function Home() {
  const jobs = useLoaderData()
  console.log(jobs);
  return (
    <div>
      <Carousel />
      <TabCatogery jobs={jobs}/>
    </div>
  )
}
