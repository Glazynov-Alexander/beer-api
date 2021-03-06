import "./App.css";
import { useEffect, useState } from "react";
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

  const setQuery = (path, value) => {
    const queries = { ...query };
    if (path) {
      queries[path] = value;
    }
    if (path === "per_page") {
      queries.page = "1";
    }
    setQueryState(queries);
    getBeers(queries);
    history.replace("?" + stringify(queries));
  };

  const getBeers = (filters = {}) => {
    history.replace("?" + stringify({ ...query, ...filters }));
    get(`/v2/beers`, {}, { ...query, ...filters }).then((beers) => {
      if (beers) {
        setBeers(beers);
      }
    });
  };

  useEffect(() => {
    getBeers(query);
    //eslint-disable-next-line
  }, []);

  return (
    <div className="Main">
      <Route exact path={"/:beerId"}>
        <Beer id={history.location.pathname.replace("/beerId=", "")} />
      </Route>
      <Route exact path={"/"}>
        {beers.length ? (
          <TableBeers
            setBeers={setBeers}
            setQueryState={setQueryState}
            getBeers={getBeers}
            beers={beers}
            query={query}
            setQuery={setQuery}
          />
        ) : (
          <div>beers none <a href="/">initial</a></div>
        )}
      </Route>
    </div>
  );
}

export default App;
