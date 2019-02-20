import React, { useState } from "react";
import axios from "axios";

const Weather = () => {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState({});
  const [loading, setLoading] = useState(false);

  const handleLocation = e => {
    setCity(e.target.value);
  };

  const handleSubmit = e => {
    e.preventDefault();
    setLoading(true)
    axios
      .get(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${city}&key=AIzaSyCv9l47P3Euk5r9AfOXys2kg7ky-6TO7zw`
      )
      .then(res => {
        return {
          coords: res.data.results[0].geometry.location,
          location: res.data.results[0].formatted_address
        };
      }).catch(e => {
        setWeather({ name: null, error: "City Not Found!  Please Try Again!" });
   
      })
      .then(result => {
        setLoading(false)
        axios
          .get(
            `http://api.openweathermap.org/data/2.5/weather?lat=${
              result.coords.lat
            }&lon=${
              result.coords.lng
            }&units=imperial&APPID=4f3823bf42f5cb17d953b5de50085cc1&`
          )
          .then(res => {
            setWeather({
              temp: Math.round(res.data.main.temp),
              name: result.location,
              tempMin: res.data.main.temp_min,
              tempMax: res.data.main.temp_max
            });
            
          });
      })
      .catch(e => {
        setWeather({ name: null, error: "City Not Found!  Please Try Again!" });
        return new Error(e)
      });
  };

  return (
    <div className="container">
      <h1 className="mt-3">What's The Weather?</h1>
      <div className="d-flex justify-content-center mt-3">
        <form className="form-inline" onSubmit={handleSubmit}>
          <input
            type="text"
            className="form-control mb-2 mr-sm-2"
            placeholder="City,State,Country"
            onChange={handleLocation}
          />
          <input
            type="submit"
            value="Get Weather"
            className="btn btn-primary mb-2"
          />
        </form>
      </div>
      {loading ? (
        <div className="d-flex justify-content-center">
          <div className="spinner-grow" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      ) : (
        <div
          className={
            weather.name
              ? "d-flex align-items-center justify-content-center mt-3 weather rounded"
              : "d-flex justify-content-center mt-3"
          }
        >
          {weather.name ? (
            <div>
              <h4>
                The Current Temperature at{" "}
                <small className="text-muted">{weather.name}</small> is{" "}
                <small className="text-primary">{weather.temp}&deg;F</small>.
                <br />
                High:{" "}
                <small className="text-success">
                  {Math.ceil(weather.tempMax)}&deg;F
                </small>
                <br />
                Low:{" "}
                <small className="text-danger">
                  {Math.floor(weather.tempMin)}&deg;F
                </small>
              </h4>
            </div>
          ) : (
            <h3 className="text-danger">{weather.error}</h3>
          )}
        </div>
      )}
    </div>
  );
};

export default Weather;
