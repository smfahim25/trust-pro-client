import React, {useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SideNav from './SideNav/SideNav';



const Header = (props) => {
    const {pageTitle} = props;
    
    const [toggleMenu, setToggleMenu] = useState(false);
    const navigate = useNavigate();
    const handleToggleMenu =() =>{
        setToggleMenu(!toggleMenu);
    }


     const goBack = () => {
        navigate(-1);
    };

    return (
        <>
            <div className="page-header">
                <img onClick={goBack} src="/assets/images/icon_back.svg" alt="Back" className="back" />
                <span className="title over-line-1">{pageTitle || ""}</span>
                <img onClick={()=>handleToggleMenu()} id="menu-icon" src="/assets/images/icon_menu_b.svg" alt="Menu" className="menu_img" />
            </div>
            <SideNav toggleMenu={toggleMenu} setToggleMenu={setToggleMenu} />
        </>
    );
};

export default Header;
