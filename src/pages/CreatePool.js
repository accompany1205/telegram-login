
import React, { useState, useRef, useEffect } from 'react';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom'
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Spinner } from 'react-bootstrap';
import axios from 'axios';
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

const REACT_APP_API_URL = process.env.REACT_APP_API_URL;

const CreatePool = () => {
    const { isLoggedIn, login, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        console.log(isLoggedIn);
        if (!isLoggedIn) {
            navigate('/login')
        }
    }, [isLoggedIn])

    const [nfts, setNfts] = useState([]);
    const [nftsRight, setNftsRight] = useState([]);
    const [selectedNftsLeft, setSelectedNftsLeft] = useState([]);
    const [selectedNftsRight, setSelectedNftsRight] = useState([]);
    const [loading, setLoading] = useState(false);

    const paginatorLeft = <Button type="button" icon="pi pi-refresh" text />;
    const paginatorRight = <Button type="button" icon="pi pi-download" text />;

    const toast = useRef(null);



    useEffect(() => {
        getNftList();
    }, [])

    const getNftList = async () => {
        // console.log("getNFTLIST");
        const res = await axios.get(REACT_APP_API_URL + '/admin/get-nft-list');
        // console.log(res);
        if (res && res.status === 200) {
            // console.log(res.data.payload.data);
            setNfts([...res.data.payload.data])
        }
    }


    const onRowSelectLeft = (event) => {
        setSelectedNftsLeft(_selectedNfts => [..._selectedNfts, event.data]);
        console.log("onRowSelectLeft", event.data);
        toast.current.show({ severity: 'info', summary: 'Product Selected', detail: `Name: ${event.data.product_name}`, life: 3000 });
    };

    const onRowUnselectLeft = (event) => {
        setSelectedNftsLeft(_selectedNfts => _selectedNfts.filter(item => item.id !== event.data.id));

        toast.current.show({ severity: 'warn', summary: 'Product Unselected', detail: `Name: ${event.data.product_name}`, life: 3000 });
    };
    const onRowSelectRight = (event) => {
        setSelectedNftsRight(_selectedNfts => [..._selectedNfts, event.data]);
        toast.current.show({ severity: 'info', summary: 'Product Selected', detail: `Name: ${event.data.product_name}`, life: 3000 });
    };

    const onRowUnselectRight = (event) => {
        setSelectedNftsRight(_selectedNfts => _selectedNfts.filter(item => item.id !== event.data.id));

        toast.current.show({ severity: 'warn', summary: 'Product Unselected', detail: `Name: ${event.data.product_name}`, life: 3000 });
    };

    const moveRight = () => {
        if (selectedNftsLeft.length === 0) {
            return;
        }
        const sku = nftsRight.length === 0 ? selectedNftsLeft[0].sku : nftsRight[0].sku;
        const count = selectedNftsLeft.length;
        if (selectedNftsLeft.filter(_item => _item.sku === sku).length < selectedNftsLeft.length) {
            toast.current.show({ severity: 'warn', summary: 'All Selected NFT must have same sku', detail: ``, life: 3000 });
            return;
        }
        setNftsRight(_nfts => [..._nfts, ...selectedNftsLeft]);
        setNfts(_nfts => _nfts.filter(_customer => selectedNftsLeft.map(item => item.id).indexOf(_customer.id) < 0))
        setSelectedNftsLeft([]);
    }
    const moveLeft = () => {
        setNfts(_nfts => [..._nfts, ...selectedNftsRight].sort(function (a, b) { return a.id - b.id }));
        setNftsRight(_nfts => _nfts.filter(_customer => selectedNftsRight.map(item => item.id).indexOf(_customer.id) < 0))
        setSelectedNftsRight([]);
    }

    const createPool = async () => {
        if (nftsRight.length === 0) {
            return;
        }
        const name = nftsRight[0].sku + ' ' + nftsRight[0].product_name + ' ' + nftsRight[0].size + ' ' + nftsRight[0].color;
        const ids = nftsRight.map(item => item.id);
        const { brand, color, product_name, size, sku } = nftsRight[0];

        setLoading(true);
        const res = await axios.post(REACT_APP_API_URL + '/admin/create-pool', {
            name, ids, sku, brand, color, product_name, size
        });
        if (res && res.status === 200) {
            toast.current.show({ severity: 'success', summary: 'New Pool created successfully!', detail: ``, life: 3000 });
            setSelectedNftsRight([]);
            setNftsRight([]);
        }
        setLoading(false);
    }

    return (
        <div className="card bg-transparent">
            <Toast ref={toast} />
            <div className='row pt-5 bg-transparent' >
                <div className='col-lg-1 col-md-1 col-sm-12'>

                </div>
                <div className='col-lg-4 col-md-4 col-sm-12 bg-transparent'>
                    <div className="pool__box__title">Select Minted NFTs</div>
                    <DataTable value={nfts} paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]} selectionMode="single" selection={selectedNftsLeft} dataKey="id"
                        onRowSelect={onRowSelectLeft} onRowUnselect={onRowUnselectLeft} metaKeySelection={false}
                        paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                        currentPageReportTemplate="{first} to {last} of {totalRecords}" paginatorLeft={paginatorLeft} paginatorRight={paginatorRight} className='border border-1 rounded-pill'>
                        <Column field="sku" header="SKU"></Column>
                        <Column field="brand" header="Model"></Column>
                        <Column field="id" header="Edition No."></Column>
                    </DataTable>
                </div>
                <div className='col-lg-2 col-md-2 col-sm-12 d-flex align-items-center justify-content-center flex-column'>
                    <div className='mb-2'>
                        <button className='btn-make shadow-sm' onClick={(e) => moveRight()}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M10.707 17.707L16.414 12l-5.707-5.707l-1.414 1.414L13.586 12l-4.293 4.293z" /></svg>                        </button>
                    </div>
                    <div>
                        <button className='btn-make shadow-sm' onClick={(e) => moveLeft()}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M13.293 6.293L7.586 12l5.707 5.707l1.414-1.414L10.414 12l4.293-4.293z" /></svg>                        </button>
                    </div>
                </div>
                <div className='col-lg-4 col-md-4 col-sm-12'>
                    <div className="pool__box__title">New Pool</div>
                    <DataTable value={nftsRight} paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]} selectionMode="single" selection={selectedNftsRight} dataKey="id"
                        onRowSelect={onRowSelectRight} onRowUnselect={onRowUnselectRight} metaKeySelection={false}
                        paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                        currentPageReportTemplate="{first} to {last} of {totalRecords}" paginatorLeft={paginatorLeft} paginatorRight={paginatorRight}>
                        <Column field="sku" header="SKU"></Column>
                        <Column field="brand" header="Model"></Column>
                        <Column field="id" header="Edition No."></Column>
                    </DataTable>
                    <div className='d-flex justify-content-center mt-5'>
                        <button className={loading ? 'btn btn-success rounded-pill creat__pool disabled' : 'btn btn-success rounded-pill creat__pool'} onClick={(e) => createPool()}>{loading ? <Spinner /> : "Create a Pool"}</button>
                    </div>
                </div>

            </div>

        </div>
    );
}

export default CreatePool;

