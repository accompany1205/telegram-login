
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Spinner } from 'react-bootstrap';
import axios from 'axios';
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

const REACT_APP_API_URL = process.env.REACT_APP_API_URL;
// import { CustomerService } from './service/CustomerService';

const _pools = [
    {
        id: 1,
        sku: "adfadsf",
        model: "asdfasdfasdf",
        edition: 34
    },
    {
        id: 2,
        sku: "adfadsf",
        model: "asdfasdfasdf",
        edition: 34
    },
    {
        id: 3,
        sku: "adfadsf",
        model: "asdfasdfasdf",
        edition: 34
    },
    {
        id: 4,
        sku: "adfadsf",
        model: "asdfasdfasdf",
        edition: 34
    }
]
const CreateListing = () => {
    const { isLoggedIn, login, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        console.log(isLoggedIn);
        if (!isLoggedIn) {
            navigate('/login')
        }
    }, [isLoggedIn])

    const [pools, setPools] = useState([]);
    const [poolsRight, setPoolsRight] = useState([]);
    const [selectedPoolsLeft, setSelectedPoolsLeft] = useState([]);
    const [selectedPoolsRight, setSelectedPoolsRight] = useState([]);

    const [aggregatePools, setAggregatePools] = useState([]);
    const [loading, setLoading] = useState(false);

    const paginatorLeft = <Button type="button" icon="pi pi-refresh" text />;
    const paginatorRight = <Button type="button" icon="pi pi-download" text />;

    const toast = useRef(null);


    useEffect(() => {
        getPoolList();
        getAggregatePoolList();
    }, [])

    const getPoolList = async () => {
        const res = await axios.get(REACT_APP_API_URL + '/admin/get-pool-list');
        if (res && res.status === 200) {
            // console.log(res.data.payload.data);
            setPools([...res.data.payload.data])
        }
    }
    const getAggregatePoolList = async () => {
        const res = await axios.get(REACT_APP_API_URL + '/admin/get-aggregate-pool-list');
        if (res && res.status === 200) {
            // console.log(res.data.payload.data);
            setAggregatePools([...res.data.payload.data])
        }
    }

    const onRowSelectLeft = (event) => {
        setSelectedPoolsLeft(_selectedPools => [..._selectedPools, event.data]);
        toast.current.show({ severity: 'info', summary: 'Product Selected', detail: `Name: ${event.data.model}`, life: 1000 });
    };

    const onRowUnselectLeft = (event) => {
        setSelectedPoolsLeft(_selectedPools => _selectedPools.filter(item => item.id !== event.data.id));

        toast.current.show({ severity: 'warn', summary: 'Product Unselected', detail: `Name: ${event.data.model}`, life: 1000 });
    };
    const onRowSelectRight = (event) => {
        setSelectedPoolsRight(_selectedPools => [..._selectedPools, event.data]);
        toast.current.show({ severity: 'info', summary: 'Product Selected', detail: `Name: ${event.data.model}`, life: 1000 });
    };

    const onRowUnselectRight = (event) => {
        setSelectedPoolsRight(_selectedPools => _selectedPools.filter(item => item.id !== event.data.id));

        toast.current.show({ severity: 'warn', summary: 'Product Unselected', detail: `Name: ${event.data.model}`, life: 1000 });
    };

    const moveRight = () => {
        if (selectedPoolsLeft.length === 0) {
            return;
        }
        const { product_name, brand, color } = poolsRight.length === 0 ? selectedPoolsLeft[0] : poolsRight[0];
        if (selectedPoolsLeft.filter(_item => _item.product_name === product_name && _item.brand === brand && _item.color === color).length < selectedPoolsLeft.length) {
            toast.current.show({ severity: 'warn', summary: 'All Selected Pool must have same product_name, brand and colour', detail: ``, life: 3000 });
            return;
        }
        setPoolsRight(_pools => [..._pools, ...selectedPoolsLeft]);
        setPools(_pools => _pools.filter(_customer => selectedPoolsLeft.indexOf(_customer) < 0))
        setSelectedPoolsLeft([]);
    }
    const moveLeft = () => {
        setPools(_pools => [..._pools, ...selectedPoolsRight].sort(function(a, b){return a.id-b.id}));
        setPoolsRight(_pools => _pools.filter(_customer => selectedPoolsRight.indexOf(_customer) < 0))
        setSelectedPoolsRight([]);
    }

    const actionAggregateTemplate = (rowData, options) => {
        return <button className='btn btn-danger rounded-pill  creat__pool fs-6' onClick={(e) => deleteAggregatePool(rowData)}>Delete a Aggregate Pool</button>
    }
    const actionTemplate = (rowData, options) => {
        return <button className='btn btn-danger rounded-pill creat__pool fs-6' onClick={(e) => deletePool(rowData)}>Delete</button>
    }
    const deleteAggregatePool = async (rowData) => {
        //console.log(1);
        const res = await axios.post(REACT_APP_API_URL + "/admin/delete-aggregate-pool", { id: rowData.id });
        if (res && res.status === 200) {
            setAggregatePools(_pools => _pools.filter(_pool => _pool.id !== rowData.id))
            getPoolList();
        }
    }

    const deletePool = async (rowData) => {
        console.log(1111);
        console.log(rowData);
        const res = await axios.post(REACT_APP_API_URL + "/admin/delete-pool", { id: rowData.id });
        if (res && res.status === 200) {
            setPools(_pools => _pools.filter(_customer => _customer.id !== rowData.id))
        }
    }

    const createAggregatePool = async () => {
        if (poolsRight.length === 0) {
            return;
        }
        const name = poolsRight[0].product_name + ' ' + poolsRight[0].color;
        const ids = poolsRight.map(_item => _item.id);
        setLoading(true);
        const res = await axios.post(REACT_APP_API_URL + "/admin/create-aggregate-pool", {
            name, ids
        })
        if(res && res.status === 200){
            const {id, name, pool_ids} = res.data.payload;
            setAggregatePools(_aggregatePools=>[..._aggregatePools, {id,name,pool_ids}])
            setPoolsRight([]);
            setSelectedPoolsRight([]);
        }
        setLoading(false);
    }
    return (
        <div className="card bg-transparent">
            <Toast ref={toast} />
            <div className='row p-5 bg-transparent' >
                <div className='col-lg-6 col-md-6 col-sm-12 bg-transparent'>
                    <div className="pool__box__title">Select Minted NFTs</div>
                    <DataTable value={pools} paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]} selectionMode="single" selection={selectedPoolsLeft} dataKey="id"
                        onRowSelect={onRowSelectLeft} onRowUnselect={onRowUnselectLeft} metaKeySelection={false}
                        paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                        currentPageReportTemplate="{first} to {last} of {totalRecords}" paginatorLeft={paginatorLeft} paginatorRight={paginatorRight} className='border border-1 rounded-pill'>
                        <Column field="id" header="Id"></Column>
                        <Column field="name" header="Pool Name"></Column>
                        <Column header="Action" body={actionTemplate}></Column>
                    </DataTable>
                </div>
                <div className='col-lg-1 col-md-1 col-sm-12 d-flex align-items-center justify-content-center flex-column'>
                    <div className='mb-2'>
                        <button className='btn-make shadow-sm' onClick={(e) => moveRight()}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M10.707 17.707L16.414 12l-5.707-5.707l-1.414 1.414L13.586 12l-4.293 4.293z" /></svg>                        </button>
                    </div>
                    <div>
                        <button className='btn-make shadow-sm' onClick={(e) => moveLeft()}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M13.293 6.293L7.586 12l5.707 5.707l1.414-1.414L10.414 12l4.293-4.293z" /></svg>                        </button>
                    </div>
                </div>
                <div className='col-lg-5 col-md-5 col-sm-12'>
                    <div className="pool__box__title">New Pool</div>
                    <DataTable value={poolsRight} paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]} selectionMode="single" selection={selectedPoolsRight} dataKey="id"
                        onRowSelect={onRowSelectRight} onRowUnselect={onRowUnselectRight} metaKeySelection={false}
                        paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                        currentPageReportTemplate="{first} to {last} of {totalRecords}" paginatorLeft={paginatorLeft} paginatorRight={paginatorRight}>
                        <Column field="id" header="Id"></Column>
                        <Column field="name" header="Pool Name"></Column>
                    </DataTable>
                    <div className='d-flex justify-content-center mt-5'>
                        <button className={loading? 'btn btn-success rounded-pill creat__pool disabled' : 'btn btn-success rounded-pill creat__pool'} onClick={(e) => createAggregatePool()}>{loading ? <Spinner/> : "Create an Aggregate Pool"}</button>
                    </div>
                </div>

            </div>
            <div className='row p-5'>
                <div className='col-lg-12 col-md-12 col-sm-12 bg-transparent'>
                    <div className="pool__box__title">Select Minted NFTs</div>
                    <DataTable value={aggregatePools} paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]} selectionMode="single" selection={selectedPoolsLeft} dataKey="id"
                        onRowSelect={onRowSelectLeft} onRowUnselect={onRowUnselectLeft} metaKeySelection={false}
                        paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                        currentPageReportTemplate="{first} to {last} of {totalRecords}" paginatorLeft={paginatorLeft} paginatorRight={paginatorRight} className='border border-1 rounded-pill'>
                        <Column field="id" header="Id"></Column>
                        <Column field="name" header="Aggregate Pool Name"></Column>
                        <Column header="Action" body={actionAggregateTemplate}>
                        </Column>
                    </DataTable>
                </div>
            </div>

        </div>
    );
}

export default CreateListing;

