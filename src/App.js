import "./App.css";
import { useState } from "react";
import { Route, useHistory } from "react-router-dom";
import { parse, stringify } from "querystring";
import TableBeers from "./pages/TableBeers/index";
import Beer from "./pages/Beer/index";
import { get } from "./api";

function App() {
  const history = useHistory();
  const [beers, setBeers] = useState([]);
  const [query, setQueryState] = useState(
    parse(history.location.search.replace("?", ""))
  );

  const getBeers = (filters = {}) => {
      setQueryState({ ...query, ...filters });
      history.replace("?" + stringify({ ...query, ...filters }));
      get(`/v2/beers`, {}, { ...query, ...filters }).then((beers) => {
      if (beers) {
          setBeers(beers);
      }
    });
  };

  return (
    <div className="Main">
      <Route exact path={"/beer-api"}>
          <TableBeers
            setBeers={setBeers}
            setQueryState={setQueryState}
            getBeers={getBeers}
            beers={beers}
            query={query}
          />
      </Route>
      <Route path={"/beer-api/:beerId"}>
          <Beer beer={beers} />
      </Route>
    </div>
  );
}

export default App;
