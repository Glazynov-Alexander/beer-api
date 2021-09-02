import React, { useEffect, useState } from "react";
import { get } from "../../api";
import { useHistory } from "react-router-dom";
import "./styles.css"

function Beer() {
  const history = useHistory();
  const [beer, setBeer] = useState([]);

  const id = history.location.pathname.replace("/beerId=", "");
  useEffect(() => {
    if (id) {
      get(`/v2/beers/${id}`).then((beers) => {
        if (beers) {
          setBeer(beers);
        }
      });
    }
    // eslint-disable-next-line
  }, []);

  return beer.map((item) => (
      <div className={"beer"} key={item.id}>
        <img width={100} height={100} src={item.image_url} alt={item.name} />
        <div className={"description"}>
          <div><h3>Name:</h3><span>{item.name}</span></div>
          <div><h3>abv:</h3><span>{item.abv}</span></div>
          <div><h3>tagline:</h3><span>{item.tagline}</span></div>
          <div><h3>description:</h3><span>{item.description}</span></div>
          <div><h3>first_brewed:</h3><span>{item.first_brewed}</span></div>
          <div><h3>brewers_tips:</h3><span>{item.brewers_tips}</span></div>
        </div>
      </div>
    ));
}

export default Beer;
