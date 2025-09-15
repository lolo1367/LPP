import Navbar from '../NavBar/Navbar';
import Footer from '../Footer/Footer';
import React, { PropsWithChildren } from 'react';
import style from './Layout.module.css';
import TooltipInitializer from '../ToolTipInitializer/ToolTipInitializer';

const Layout: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <>
      <TooltipInitializer />
		  <div className={style.layoutContainer}>
			  <Navbar />

			  <main className={style.main}>

					<div className={style.centeredContainer}>
						{children}
					</div>
				</main>
        <Footer />
      </div>
    </>
  );
};

export default Layout;
