import { ReactNode } from 'react';
import Navbar from '../page/navbar';

interface LayoutProps {
    children: ReactNode; 
}

function Layout({ children }: LayoutProps) {
    return (
        <>
            <Navbar />
            {children}
        </>
    );
}

export default Layout;
