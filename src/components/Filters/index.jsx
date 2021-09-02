import React from "react";
import "./styles.css"

const Filters = ({setValueFilter, filters, getBeers, fields}) => {
    return (
        <div>
            <div className="filters">
                {fields.map((field) => (
                        <input
                            placeholder={field}
                            key={field}
                            value={filters[field] || ""}
                            style={{ margin: 10 }}
                            type="number"
                            onChange={(event) =>
                                setValueFilter(field, event.target.value)
                            }
                        />
                    ))}
            </div>
            <button className={"submit"} onClick={() => getBeers(filters)}>Filter</button>
        </div>
    )
}

export default Filters
