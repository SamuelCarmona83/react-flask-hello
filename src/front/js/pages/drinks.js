import React, { useEffect, useState} from "react";

export const DrinksTable = () => {

    const [ drinks, setDrinks ] = useState({ 
        results: []
    })
    const [ page, setPage ] = useState(1)

    const [ elementos, setElementos ] = useState(15)

    useEffect(()=>{
        const searchDrinks = async () => {
            const resp = await fetch(`https://cautious-space-zebra-6r9v5rp6p65f4499-3000.app.github.dev/drinks-paginated?page=${page}&limit=${elementos}`)
            const data = await resp.json()
            setDrinks(data)
        }
        searchDrinks();
    },[page])

    return <>
        <div className="text-center w-100 my-5">
            <div className="mx-auto">
            <table className="table table-hover">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Name</th>
                        <th scope="col">Price</th>
                    </tr>
                </thead>
                <tbody>
                    {drinks && drinks.results.map( drink => <tr>
                        <th scope="row">{drink.id}</th>
                        <td>{drink.name}</td>
                        <td>${drink.mark}</td>
                    </tr>)}
                </tbody>
            </table>
            <nav className="mx-auto my-2" aria-label="Page navigation example">
                <ul className="pagination  d-flex justify-content-center">
                    <li className="page-item">
                        <button className="page-link text-dark" onClick={()=> page > 1 ? setPage(page - 1) : () => {} }>
                            Previous
                        </button>
                    </li>
                    { drinks && [ ...Array(drinks.last_page).keys() ].slice(1).map( pageNumber => {
                        return <li className="page-item">
                            <button className="page-link text-dark" onClick={() => setPage(pageNumber)}>{pageNumber}</button>
                            </li>
                    })}
                    <li className="page-item">
                        <button className="page-link text-dark" onClick={()=> page < drinks.last_page ? setPage(page + 1) : () => {} }>
                            Next
                        </button>
                    </li>
                </ul>
            </nav>    
            </div>
        </div>
    </>
}