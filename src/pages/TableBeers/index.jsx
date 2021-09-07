import React, { useCallback, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import Pagination from "../../components/Pagination/index";
import Filters from "../../components/Filters/index";
import { Chart } from "react-google-charts";
import {ReactComponent as ReactLogo} from "../../sorter.svg"
import "./styles.css";

let initialBeers = [];

function TableBeers({ beers, query, getBeers, setBeers, setQueryState }) {
  const history = useHistory();
  const [filters, setFilters] = useState({ ...query });
  const [sorting, setSorter] = useState("");
  const pageQuery = {...query}
  const fields = [
    "abv_gt",
    "das",
    "abv_lt",
    "ibu_gt",
    "ibu_lt",
    "ebc_gt",
    "ebc_lt",
  ];

  const sorter = () => {
    const statusSorter = "ascend" === sorting ? "descend" : "descend" === sorting ? "" : "ascend";
    setSorter(statusSorter);
    if (statusSorter === "ascend") {
      initialBeers = [...beers];
      setBeers([
        ...beers.sort((beer, nextBeer) => beer.abv > nextBeer.abv && -1),
      ]);
    }
    if (statusSorter === "descend") {
      setBeers([
        ...beers.sort((beer, nextBeer) => beer.abv < nextBeer.abv && -1),
      ]);
    }
    if (!statusSorter) {
      setBeers([...initialBeers]);
    }
  };

  useEffect(() => {
    setFilters({...filters, per_page:query.per_page || 25})
    setSorter("")
      //eslint-disable-next-line
  }, [query]);

  const setValueFilter = useCallback(
    (field, value) => {
      if (value) {
        return setFilters({ ...query, ...filters, [field]: value });
      }
      const bad = { ...query, ...filters };

      delete bad[field];
      setQueryState({...bad})
      setFilters({...bad});
      //eslint-disable-next-line
  }, [filters]);

  const data = [
    ["ABV", "ABV", { role: "style", link: "" }],
    ...beers.map((beer) => [beer.name, beer.abv, "silver" ]),
  ];

  const handler = function (e, events, chart) {
      const parts = e.targetID.split("#");
      if(parts.includes("bar")) {
          let idx = parts[parts.indexOf("bar") + 2];
          idx = parseInt(idx);
          beers[idx] && history.push(`/beer-api/beerId=${beers[idx].id}`);
          events.removeAllListeners(chart)
      }
  };

  return beers.length ? (
    <div className="TableBeers">
      <Chart
        className={"schedule"}
        chartType="ColumnChart"
        data={data}
        chartEvents={[
            {
                eventName: "ready",
                callback: async ({ chartWrapper, google }) => {
                   await google.visualization.events.addListener(
                        chartWrapper.getChart(),
                        "click",
                       (e) =>handler(e, google.visualization.events, chartWrapper.getChart())
                    );
                }
            }
        ]}
        options={{
            legend: "none",
            curveType: "function",
            enableInteractivity: true }}
        width="90%"
        height="400px"
      />

      <Filters
        filters={filters}
        fields={fields}
        setValueFilter={setValueFilter}
        getBeers={getBeers}
      />

      <Pagination
        rowsPerPageOptions={[5, 10, 25]}
        count={500}
        beers={beers}
        rowsPerPage={+pageQuery["per_page"] || 25}
        getBeers={getBeers}
        page={+pageQuery.page || 1}
      />

      <ReactLogo onClick={sorter} className={sorting}/>
      <table>
        <thead className={"headers"}>
          <tr>
            <th width={250}>Name</th>
            <th width={250}>Tagline</th>
            <th width={90}>Photo</th>
            <th width={75}>ABV</th>
          </tr>
        </thead>
        <tbody>
          { beers.map((item) => (
                <tr className={"body"} key={item.id + item.name}>
                  <td>
                    <h3>{item.name}</h3>
                  </td>
                  <td>{item.tagline}</td>
                  <td >
                    <img
                      onClick={() => history.push(`/beer-api/beerId=${item.id}`)}
                      src={item.image_url}
                      alt={item.name}
                    />
                  </td>
                  <td>{item.abv}</td>
                </tr>
              ))}
        </tbody>
      </table>
    </div>
  ) : <div>beers none <a href={"/beer-api"}>initial</a></div>
}

export default TableBeers;
