
import React, { useState, useRef, useEffect } from 'react';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { useNavigate } from 'react-router-dom'
import { Column } from 'primereact/column';
import axios from 'axios';
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

const REACT_APP_API_URL = process.env.REACT_APP_API_URL;

const DealStatus = () => {
    const { isLoggedIn, login, logout } = useContext(AuthContext);

    const navigate = useNavigate();

    useEffect(() => {
        console.log(isLoggedIn);
        if (!isLoggedIn) {
            navigate('/login')
        }
    }, [isLoggedIn])

    const [deals, setDeals] = useState([]);

    const paginatorLeft = <Button type="button" icon="pi pi-refresh" text />;
    const paginatorRight = <Button type="button" icon="pi pi-download" text />;

    useEffect(() => {
        getDealStatus();
    }, [])

    const getDealStatus = async () => {
        // console.log("getNFTLIST");
        const res = await axios.get(REACT_APP_API_URL + '/admin/get-deal-status');
        // console.log(res);
        if (res && res.status === 200) {
            console.log(res.data.payload);
            setDeals(res.data.payload);
        }
    }
    const bidAndAskTemplate = (rowData) => {
        return <span>{rowData.lowestAsk}/{rowData.highestBid}</span>
    }

    const bidsAndPriceTemplate = (rowData) => {
        return (
            <div>
                {rowData.bids.length > 0 && rowData.bids.map((item,index)=>(
                    <div key={index}>{item.value} x {item.count}</div>
                ))}
            </div>
        )
    }

    const asksAndPriceTemplate = (rowData) => {
        return (
            <div>
                {rowData.asks.length > 0 && rowData.asks.map((item,index)=>(
                    <div key={index}>{item.value} x {item.count}</div>
                ))}
            </div>
        )
    }

    if(!isLoggedIn){
        window.history.pushState(null, '', '/login');
    }
    else{
        return (
            <div className="card bg-transparent">
                <div className='row p-5 bg-transparent' >
                    <div className='col-lg-12 col-md-12 col-sm-12 bg-transparent'>
                        <div className="pool__box__title">Deal Status</div>
                        <DataTable value={deals} paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]} dataKey="id"
                            metaKeySelection={false}
                            paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                            currentPageReportTemplate="{first} to {last} of {totalRecords}" paginatorLeft={paginatorLeft} paginatorRight={paginatorRight} className='border border-1 rounded'>
                            <Column field="name" header="Pool Name"></Column>
                            <Column header="Highest Bid/Lowest Ask" body={bidAndAskTemplate}></Column>
                            <Column field="id" header="#Bids x Price" body={bidsAndPriceTemplate}></Column>
                            <Column field="id" header="#Asks x Price" body={asksAndPriceTemplate}></Column>
                            <Column field="dealPrice" header="Deal Price"></Column>
                        </DataTable>
                    </div>
                </div>
            </div>
        );
    }
    
}

export default DealStatus;

