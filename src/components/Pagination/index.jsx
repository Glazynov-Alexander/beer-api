import React, {useState} from "react";
import "./styles.css"

function Pagination({
  count,
  rowsPerPage,
  page,
  beers,
  setQuery,
  getBeers,
  filters,
  rowsPerPageOptions
}) {

  const [show, changeShow] = useState(false)

  const setPerPage = (field, row) => {
      changeShow(false)
      setQuery(field, row)
      getBeers({...filters, [field]: row})
  }

  const pages = Array.from(
    { length: Math.floor(count / rowsPerPage) },
    (_, i) => i + 1
  );

  // eslint-disable-next-line array-callback-return
  return pages.map((item) => {
    if (item === page) {
      const backPage = item - 1;
      const nextPage = item + 1;

      return (
        <div key={item} className={"pagination"}>
            <div className={"perPages"}>
                <div onClick={() => changeShow(!show)} className={"nowPerPage"}>{rowsPerPage}</div>
                <div className={"listPerPages"}>
                    {show && rowsPerPageOptions.map((row) =>  (
                            <div key={row} onClick={() => setPerPage("per_page", row)}>
                                {row}
                            </div>
                        ))}
                </div>
            </div>
          {!!backPage && (
            <button style={{width: 30, height: 30, margin: 5}} onClick={() => setPerPage("page", backPage)}>
              {backPage}
            </button>
          )}

          <button style={{width: 30, height: 30, margin: 5}} disabled={item === page}>
            {item}
          </button>
          {nextPage <= pages.length && beers.length === rowsPerPage && (
            <button style={{width: 30, height: 30, margin: 5}} onClick={() => setPerPage("page", nextPage)}>
              {nextPage}
            </button>
          )}
        </div>
      );
    }
  });
}

export default Pagination;
