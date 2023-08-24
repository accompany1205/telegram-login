import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

const tabs = [
    {
        index: 0,
        title: "Create a Pool",
        svg: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M12 22c5.131 0 9-1.935 9-4.5V7h-.053c.033-.164.053-.33.053-.5C21 3.935 17.131 2 12 2C7.209 2 3.52 3.688 3.053 6H3v11.5c0 2.565 3.869 4.5 9 4.5zm0-2c-4.273 0-7-1.48-7-2.5V9.394C6.623 10.387 9.111 11 12 11s5.377-.613 7-1.606V17.5c0 1.02-2.727 2.5-7 2.5zm0-16c4.273 0 7 1.48 7 2.5S16.273 9 12 9S5 7.52 5 6.5S7.727 4 12 4z" /></svg>,
        href: '/create-pool'
    },
    {
        index: 1,
        title: "Create a Listing",
        svg: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M4 7h11v2H4zm0 4h11v2H4zm0 4h7v2H4zm15.299-2.708l-4.3 4.291l-1.292-1.291l-1.414 1.415l2.706 2.704l5.712-5.703z" /></svg>,
        href: '/create-listing'
    },
    {
        index: 2,
        title: "Company List",
        svg: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M4 7h11v2H4zm0 4h11v2H4zm0 4h7v2H4zm15.299-2.708l-4.3 4.291l-1.292-1.291l-1.414 1.415l2.706 2.704l5.712-5.703z" /></svg>,
        href: '/company-list'
    },
    {
        index: 2,
        title: "Imported Pools",
        svg: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M4 7h11v2H4zm0 4h11v2H4zm0 4h7v2H4zm15.299-2.708l-4.3 4.291l-1.292-1.291l-1.414 1.415l2.706 2.704l5.712-5.703z" /></svg>,
        href: '/imported-pool'
    },
    {
        index: 3,
        title: "Deal Status",
        svg: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M7 11h2v2H7zm0 4h2v2H7zm4-4h2v2h-2zm0 4h2v2h-2zm4-4h2v2h-2zm0 4h2v2h-2z" /><path fill="currentColor" d="M5 22h14c1.103 0 2-.897 2-2V6c0-1.103-.897-2-2-2h-2V2h-2v2H9V2H7v2H5c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2zM19 8l.001 12H5V8h14z" /></svg>,
        href: '/deal-status'
    },
    {
        index: 4,
        title: "Royalties and Fees",
        svg: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M12 15c-1.84 0-2-.86-2-1H8c0 .92.66 2.55 3 2.92V18h2v-1.08c2-.34 3-1.63 3-2.92c0-1.12-.52-3-4-3c-2 0-2-.63-2-1s.7-1 2-1s1.39.64 1.4 1h2A3 3 0 0 0 13 7.12V6h-2v1.09C9 7.42 8 8.71 8 10c0 1.12.52 3 4 3c2 0 2 .68 2 1s-.62 1-2 1z" /><path fill="currentColor" d="M5 2H2v2h2v17a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V4h2V2H5zm13 18H6V4h12z" /></svg>,
        href: '/royalty-and-fee'
    },
    {
        index: 5,
        title: "Log Out",
        svg: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="m2 12l5 4v-3h9v-2H7V8z" /><path fill="currentColor" d="M13.001 2.999a8.938 8.938 0 0 0-6.364 2.637L8.051 7.05c1.322-1.322 3.08-2.051 4.95-2.051s3.628.729 4.95 2.051s2.051 3.08 2.051 4.95s-.729 3.628-2.051 4.95s-3.08 2.051-4.95 2.051s-3.628-.729-4.95-2.051l-1.414 1.414c1.699 1.7 3.959 2.637 6.364 2.637s4.665-.937 6.364-2.637c1.7-1.699 2.637-3.959 2.637-6.364s-.937-4.665-2.637-6.364a8.938 8.938 0 0 0-6.364-2.637z" /></svg>,
        href: '/logout'
    },
]

const Sidebar = () => {
    const { logout, isLoggedIn } = useContext(AuthContext);
    const [tab, setActiveTab] = useState(0);
    const [indicatorPositionY, setIndicatorPosition] = useState(0);
    const [isShow, setShow] = useState(true);
    useEffect(() => {

        const currentUrl = window.location.href;
        const route = currentUrl.split('/')[currentUrl.split('/').length - 1];
        if(tabs.map(_tab=>_tab.href).indexOf('/'+route) < 0){
            setShow(false)
            if(route !== 'signup' && route !== "login"){
                // console.log(21341234123);
                window.location.href = "/login"
            }
            return;
        }
        setShow(true);
        const _tab = tabs.filter(_tab_ => _tab_.href === '/' + route)[0];
        // console.log(_tab);
        // console.log()
        if (_tab.index !== tab)
            setActiveTab(_tab_ => _tab ? _tab.index : 0);
    }, [])
    useEffect(() => {
        console.log({ tab });
        setIndicatorPosition(60 * tab);
    }, [tab])

    useEffect(() => {
        if(isLoggedIn){
            setShow(()=> true);
        }
    }, [isLoggedIn])

    const handleClick = (index) => {
        setActiveTab(index);
        console.log(index);
        if(index === 5){
            logout();
        }
    }
    return (
        <>{
            isShow && (
                <div className="sidebar">
                    <div className='sidebar__logo'>DB Admin Panel</div>
                    <div className="flex-column sidebar__menu">
                        <div className="sidebar__menu__indicator" style={{ transform: "translateX(-50%) translateY(" + indicatorPositionY + "px)", height: "60px" }}></div>

                        {tabs.map((_tab, index) => (
                            <Link key={index} to={_tab.href} onClick={(e) => { handleClick(index) }}>
                                <div className="sidebar__menu__item">
                                    <div className="sidebar__menu__item__icon">
                                        {_tab.svg}
                                    </div>
                                    <div className="sidebar__menu__item__text">
                                        {_tab.title}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )
        }</>

    );
};

export default Sidebar;
