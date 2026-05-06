//import logo from './logo.svg';
import { Outlet } from "react-router-dom";
import "./App.css";
import Header from "./Common/Header";
import { useEffect, useState } from "react";
import { serviceAPI } from "./utils/api";

function App() {
  let [data, setData] = useState([]);
  let [services, setServices] = useState([]);
  let [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch from backend API
        const response = await fetch("http://localhost:5000/Vechile.json");
        const vehicleData = await response.json();
        setData(vehicleData);
        
        // Fetch services
        const servicesData = await serviceAPI.getServices();
        setServices(servicesData);
      } catch (err) {
        console.error('Error fetching data:', err);
        // Fallback to local data if backend is not available
        try {
          const response = await fetch("/Vechile.json");
          const localData = await response.json();
          setData(localData);
        } catch (localErr) {
          console.error('Error fetching local data:', localErr);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);


  return (
    <div className="App">
      <Header></Header>
      <Outlet context={{ data, services, loading }}></Outlet>
    </div>
  );
}

export default App;