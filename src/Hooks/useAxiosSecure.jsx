import axios from 'axios';
import React, { useEffect } from 'react';

import { useNavigate } from 'react-router';
import UseAuth from './UseAuth';

const axiosSecure = axios.create({
    baseURL:'http://localhost:3000'
})

const useAxiosSecure = () => {

    const {user, logOut}=UseAuth()
    const navigate = useNavigate()

    useEffect(() =>{
        

         const reqInterceptor = axiosSecure.interceptors.request.use(config=>{
            config.headers.Authorization =`Bearer ${user?.accessToken}`
            return config

         })
          
          const resInterceptor= axiosSecure.interceptors.response.use((response)=>{

            return response
          },(error)=>{

              console.log(error)
              const statusCode = error.status
              if(statusCode === 401 || statusCode === 403){
                  logOut()
                  .then(()=>{
                      navigate('/login')  
                  })

              }
              return Promise.reject(error)
          })

         
          return () =>{
            axiosSecure.interceptors.request.eject(reqInterceptor)
            axiosSecure.interceptors.request.eject(resInterceptor)
          }
    },
    [user,logOut,navigate])

    
    return axiosSecure
      
};

export default useAxiosSecure;