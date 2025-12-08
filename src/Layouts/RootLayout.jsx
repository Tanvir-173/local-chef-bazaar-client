// import React from 'react';
// import { Outlet } from 'react-router';
// import Navber from '../Pages/Shared/Navber/Navber';
// import Footer from '../Pages/Shared/Footer/Footer';

// const RootLayout = () => {
//     return (
//         <div>
//             <Navber></Navber>
//             <Outlet></Outlet>
//             <Footer></Footer>
//         </div>
//     );
// };

// export default RootLayout;
import React from 'react';
import { Outlet } from 'react-router';
import Navber from '../Pages/Shared/Navber/Navber';
import Footer from '../Pages/Shared/Footer/Footer';
import { Toaster } from 'react-hot-toast'; // import Toaster

const RootLayout = () => {
    return (
        <div>
            <Navber />
            
            {/* Toast container */}
            <Toaster position="top-right" reverseOrder={false} />

            <Outlet />
            <Footer />
        </div>
    );
};

export default RootLayout;
