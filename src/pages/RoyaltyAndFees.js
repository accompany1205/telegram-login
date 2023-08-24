
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom'
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';

const REACT_APP_API_URL = process.env.REACT_APP_API_URL;

const RoyaltyAndFees = () => {
    const [deals, setDeals] = useState([]);
    const [feeEarned, setFeeEarned] = useState(0);
    const [loyaltyEarned, setLoyaltyEarned] = useState(0);
    const [numberOfClients, setNumberOfClients] = useState(0);
    const paginatorLeft = <Button type="button" icon="pi pi-refresh" text />;
    const paginatorRight = <Button type="button" icon="pi pi-download" text />;

    useEffect(() => {
        getRoyaltyAndFee();
        getDeal();
    }, [])

    const { isLoggedIn, login, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        console.log(isLoggedIn);
        if (!isLoggedIn) {
            navigate('/login')
        }
    }, [isLoggedIn])
    

    const getRoyaltyAndFee = async () => {
        // console.log("getNFTLIST");
        const res = await axios.get(REACT_APP_API_URL + '/admin/get-royalty-fee');
        // console.log(res);
        if (res && res.status === 200) {
            console.log(res.data.payload);
            setFeeEarned(res.data.payload.feeEarned);
            setLoyaltyEarned(res.data.payload.loyaltyEarned);
            setNumberOfClients(res.data.payload.numberOfClients);
        }
    }
    const getDeal = async () => {
        // console.log("getNFTLIST");
        const res = await axios.get(REACT_APP_API_URL + '/admin/get-deal');
        // console.log(res);
        if (res && res.status === 200) {
            console.log(res.data.payload);
            setDeals(res.data.payload);
        }
    }
    return (
        <div className="card bg-transparent">
            <div className='row p-5 bg-transparent' >
                <div className='col-lg-12 col-md-12 col-sm-12 bg-transparent mb-5 '>
                    <div className='border-dotted p-4'>
                        <div className="pool__box__title text-center fs-3">Royalties and Fees Summary</div>
                        <div className='royalties__container__summary'>
                            Number of Clients - {feeEarned}
                        </div>
                        <div className='royalties__container__summary'>
                            Total Royalties Earned - ${feeEarned}
                        </div>
                        <div className='royalties__container__summary'>
                            Total Fees Collected - ${loyaltyEarned}
                        </div>
                    </div>

                </div>
                <div className='col-lg-12 col-md-12 col-sm-12 bg-transparent'>
                    <div className="pool__box__title">Deal Status</div>
                    <DataTable value={deals} paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]} dataKey="id"
                        metaKeySelection={false}
                        paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                        currentPageReportTemplate="{first} to {last} of {totalRecords}" paginatorLeft={paginatorLeft} paginatorRight={paginatorRight} className='border border-1 rounded'>
                        <Column field="id" header="Transaction No."></Column>
                        <Column field="bid_email" header="Wallet Buyer Email"></Column>
                        <Column field="ask_email" header="Wallet Seller Email"></Column>
                        <Column field="amount" header="Price Exchanged"></Column>
                        <Column field="fee" header="Fees Paid"></Column>
                        <Column field="royalty" header="Royalty Paid"></Column>
                    </DataTable>
                </div>
            </div>
        </div>
    );
}

export default RoyaltyAndFees;

