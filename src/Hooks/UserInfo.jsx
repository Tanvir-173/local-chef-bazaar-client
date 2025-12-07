import { useQuery } from "@tanstack/react-query";
import UseAuth from "./UseAuth";
import useAxiosSecure from "./useAxiosSecure";

const UserInfo = () => {
  const { user } = UseAuth();
  const axiosSecure = useAxiosSecure();

  const { data: userInfo = {}, isLoading } = useQuery({
    queryKey: ["userInfo", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/${user.email}`);
      return res.data;
    },
  });

  return { userInfo, isLoading };
};

export default UserInfo;
