import ListHeader from "./components/ListHeader";
import ListItem from "./components/ListItem"
import {useEffect, useState} from "react"
import Auth from "./components/Auth"
import { useCookies } from "react-cookie";

const App = () => {
  const [cookies, setCookie, removeCookie] = useCookies(null)
  const authToken = cookies.AuthToken
  const userEmail = cookies.Email;
  const [tasks, setTasks] = useState(null);

  const getData = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_SERVERURL}/todos/${userEmail}`);
      const json = await response.json()
      setTasks(json)
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if(authToken) {
      getData()
    }
  }, [])

  const sortedTasks = tasks?.sort((a, b) => new Date(a.date) - new Date(b.date))

  console.log(cookies)

  return (
    <div className="app">   
    {!authToken && <Auth />} 
      {authToken && 
      <>
      <ListHeader listName={`${userEmail}'s todo list`} getData={getData} />
      {sortedTasks?.map(task => <ListItem key={tasks.id} task={task} getData={getData}/>)}
      </>}
    </div>
  );
};

export default App;
