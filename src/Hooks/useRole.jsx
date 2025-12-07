import { useQuery } from '@tanstack/react-query';
import React from 'react';

import useAxiosSecure from './useAxiosSecure';
import UseAuth from './UseAuth';

const useRole = () => {
    const {user}=UseAuth()
    const axiosSecure = useAxiosSecure()
    const {isLoading:roleLoading,data: role="user"} = useQuery({
        queryKey:['user-role',user?.eamil],
        queryFn: async()=>{
            const res= await axiosSecure.get(`/users/${user.email}/role`)
            console.log(res.data)
            return res.data?.role || 'user'

        }
    })

    return {role,roleLoading}
};

export default useRole;