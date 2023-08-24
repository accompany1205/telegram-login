
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Spinner, Modal } from 'react-bootstrap';
import axios from 'axios';
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

const REACT_APP_API_URL = process.env.REACT_APP_API_URL;


const CompanyList = () => {
    const { isLoggedIn, login, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        console.log(isLoggedIn);
        if (!isLoggedIn) {
            navigate('/login')
        }
    }, [isLoggedIn])

    const [companyList, setCompanyList] = useState([]);
    const [filteredList, setFilteredList] = useState([]);
    const [selectedCompanyList, setSelectedCompanyList] = useState([]);
    const [serachText, setSearchText] = useState('');
    const [chargeAmount, setChargeAmount] = useState(0);
    const [isShow, setIsShow] = React.useState(false);

    const paginatorLeft = <Button type="button" icon="pi pi-refresh" text />;
    const paginatorRight = <Button type="button" icon="pi pi-download" text />;

    const toast = useRef(null);


    useEffect(() => {
        getCompanyList();
    }, [])

    useEffect(() => {
        setFilteredList(() => companyList.filter(_company => _company.company_name.toLowerCase().includes(serachText) || _company.address.includes(serachText)))
    }, [serachText, companyList])

    const openModal = () => {
        setIsShow(() => true)
    }

    const closeModal = () => {
        setIsShow(() => false);
    }

    const getCompanyList = async () => {
        const res = await axios.get(REACT_APP_API_URL + '/admin/get-company-list');
        console.log({ res });
        if (res && res.status === 200 && res.data && res.data.payload && res.data.payload.length > 0) {
            // console.log(res.data.payload.data);
            setCompanyList([...res.data.payload])
        }
    }


    const onRowSelect = (event) => {
        setSelectedCompanyList(_selectedPools => [..._selectedPools, event.data]);
        toast.current.show({ severity: 'info', summary: 'Product Selected', detail: `Name: ${event.data.model}`, life: 1000 });
    };

    const onRowUnselect = (event) => {
        setSelectedCompanyList(_selectedPools => _selectedPools.filter(item => item.id !== event.data.id));

        toast.current.show({ severity: 'warn', summary: 'Product Unselected', detail: `Name: ${event.data.model}`, life: 1000 });
    };


    const actionTemplate = (rowData, options) => {
        return <button className='btn btn-success rounded-pill  creat__pool fs-6' onClick={(e) => chargeHederaToCompanyAccount(rowData)}>Charge Hedera Token</button>
    }

    const chargeHederaToCompanyAccount = async (rowData) => {
        if (rowData) {
            setSelectedCompanyList(_list => [..._list, rowData]);
            // openModal();
            openModal();
        } else {
            if (selectedCompanyList.length > 0) {
                openModal();
            }
        }
        //console.log(1);
        // const res = await axios.post(REACT_APP_API_URL + "/admin/charge-to-company", { id: rowData.id });
        // if (res && res.status === 200) {
        //     // setAggregatePools(_pools => _pools.filter(_pool => _pool.id !== rowData.id))
        //     // getCompanyList();
        // }
    }

    const handleChangeAmount = (e) => {
        setChargeAmount(() => Number(e.target.value))
    }
    const handleChargeClick = async () => {
        const address = selectedCompanyList.map(_company => _company.address);
        console.log(address);
        const res = await axios.post(REACT_APP_API_URL + '/admin/charge-to-company', {
            accountArray: address,
            chargeAmount: chargeAmount * Math.pow(10, 8)
        },
            {
                timeout: 30000,
            });

        console.log({ res });
        if (res && res.status === 200) {
            setSelectedCompanyList(() => []);
            setCompanyList(_companyLists => _companyLists.map(_company => {
                if (address.indexOf(_company.address) >= 0) {
                    return {
                        ..._company,
                        balance: _company.balance + chargeAmount
                    }
                }else{
                    return {
                        ..._company
                    }
                }
            }))
            closeModal();
        }
    }



    return (
        <div className="card bg-transparent">
            <Toast ref={toast} />

            <div className='row p-5 pb-0'>
                <div className='col-lg-4 col-md-6 col-sm-12'>
                    {
                        selectedCompanyList.length > 0 && (
                            <button className='btn btn-success rounded-pill  creat__pool fs-6' onClick={(e) => chargeHederaToCompanyAccount()}>Charge Hedera Token</button>
                        )
                    }
                </div>
                <div className='col-lg-4 col-md-6 col-sm-12'>
                    <input type="text" placeholder="search by name or account" className='form-control' value={serachText} onChange={(e) => { setSearchText(() => e.target.value) }} />
                </div>
            </div>
            <div className='row p-5 pt-0'>
                <div className='col-lg-12 col-md-12 col-sm-12 bg-transparent'>
                    <div className="pool__box__title">Select Minted NFTs</div>
                    <DataTable value={filteredList} paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]} selectionMode="single" selection={selectedCompanyList} dataKey="id"
                        onRowSelect={onRowSelect} onRowUnselect={onRowUnselect} metaKeySelection={false}
                        paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                        currentPageReportTemplate="{first} to {last} of {totalRecords}" paginatorLeft={paginatorLeft} paginatorRight={paginatorRight} className='border border-1 rounded-pill'>
                        <Column field="id" header="Id"></Column>
                        <Column field="company_name" header="Company Name"></Column>
                        <Column field="balance" header="Account Balance"></Column>
                        <Column field="address" header="Account Id"></Column>
                        <Column header="Action" body={actionTemplate}>
                        </Column>
                    </DataTable>
                </div>
            </div>
            <Modal show={isShow}>
                <Modal.Header closeButton onClick={closeModal}>
                    <Modal.Title>Charge to Company account</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <input
                        type="number"
                        placeholder="charge amount"
                        className='form-control'
                        defaultValue={chargeAmount}
                        onChange={(e) => { handleChangeAmount(e) }} />

                </Modal.Body>
                <Modal.Footer>
                    <button className='btn btn-secondary creat__pool fs-6' onClick={(e) => closeModal}>Cancel</button>

                    <button className='btn btn-success creat__pool fs-6' onClick={(e) => handleChargeClick()}>
                        Charge
                    </button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default CompanyList;

