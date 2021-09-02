import React, { useCallback, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import Pagination from "../../components/Pagination/index";
import Filters from "../../components/Filters/index";
import { Chart } from "react-google-charts";
import {ReactComponent as ReactLogo} from "../../sorter.svg"
import "./styles.css";

let initialBeers = [];

function TableBeers({ beers, query, setQuery, getBeers, setBeers, setQueryState }) {
  const history = useHistory();
  const [filters, setFilters] = useState({ ...query });
  const [sorting, setSorter] = useState("");

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
    setSorter("");
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
    ["ABV", "ABV", { role: "style" }],
    ...beers.map((beer) => [beer.name, beer.abv, "silver"]),
  ];

  return (
    <div className="TableBeers">
      <Chart
        className={"schedule"}
        chartType="ColumnChart"
        data={data}
        options={{ legend: "none" }}
        width="80%"
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
        rowsPerPage={+query["per_page"] || 25}
        page={+query.page || 1}
        onRowsPerPageChange={(e) => setQuery("per_page", e)}
        setQuery={setQuery}
      />

      <ReactLogo onClick={sorter} className={sorting}/>
      <table>
        <thead className={"headers"}>
          <tr>
            <th width={250}>Name</th>
            <th width={250}>Tagline</th>
            <th width={90}>Photo</th>
            <th width={150}>ABV</th>
          </tr>
        </thead>
        <tbody>
          {beers.length &&
            beers.map((item) => {
              return (
                <tr className={"body"} key={item.id + item.name}>
                  <td>
                    <h3>{item.name}</h3>
                  </td>
                  <td>{item.tagline}</td>
                  <td style={{ padding: 15 }}>
                    <img
                      onClick={() => history.push(`/beerId=${item.id}`)}
                      width={500}
                      height={500}
                      src={item.image_url}
                      alt={item.name}
                    />
                  </td>
                  <td>{item.abv}</td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
}

export default TableBeers;
