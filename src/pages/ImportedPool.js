
import React, { useState, useRef, useEffect } from 'react';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { useNavigate } from 'react-router-dom'
import { Column } from 'primereact/column';
import axios from 'axios';
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

const REACT_APP_API_URL = process.env.REACT_APP_API_URL;

const ImportedPool = () => {
    const { isLoggedIn, login, logout } = useContext(AuthContext);

    const navigate = useNavigate();

    useEffect(() => {
        console.log(isLoggedIn);
        if (!isLoggedIn) {
            navigate('/login')
        }
    }, [isLoggedIn])

    const [list, setList] = useState([]);

    const paginatorLeft = <Button type="button" icon="pi pi-refresh" text />;
    const paginatorRight = <Button type="button" icon="pi pi-download" text />;

    useEffect(() => {
        getImportedPoolList();
    }, [])

    const getImportedPoolList = async () => {
        // console.log("getNFTLIST");
        const res = await axios.get(REACT_APP_API_URL + '/admin/get-import-pool-list');
        // console.log(res);
        if (res && res.status === 200) {
            console.log(res.data.payload.data);
            setList(res.data.payload.data);
        }
    }


    const actionAggregateTemplate = (rowData, options) => {
        return <button className='btn btn-danger rounded-pill  creat__pool fs-6' onClick={(e) => approveImportedPool(rowData.id)}>Approve</button>
    }

    const approveImportedPool = async (id) => {
        const res = await axios.post(REACT_APP_API_URL + '/admin/approve-imported-pool', { id });
        // console.log(res);
        if (res && res.status === 200) {
            console.log(res.data.payload);
            setList(_list=>_list.filter(item => item.id !== id));
        }
    }

    if (!isLoggedIn) {
        window.history.pushState(null, '', '/login');
    }
    else {
        return (
            <div className="card bg-transparent">
                <div className='row p-5 bg-transparent' >
                    <div className='col-lg-12 col-md-12 col-sm-12 bg-transparent'>
                        <div className="pool__box__title">Imported Pools</div>
                        <DataTable value={list} paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]} dataKey="id"
                            metaKeySelection={false}
                            paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                            currentPageReportTemplate="{first} to {last} of {totalRecords}" paginatorLeft={paginatorLeft} paginatorRight={paginatorRight} className='border border-1 rounded'>
                            <Column field="name" header="Pool Name"></Column>
                            <Column field="description" header="Description"></Column>
                            <Column header="Action" body={actionAggregateTemplate}>
                            </Column>
                        </DataTable>
                    </div>
                </div>
            </div>
        );
    }

}

export default ImportedPool;

