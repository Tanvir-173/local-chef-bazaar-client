import { useSearchParams } from "react-router";
import { useEffect } from "react";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";


export default function PaymentSuccess() {
  const [params] = useSearchParams();
  const sessionId = params.get("session_id");
  const orderId = params.get("order_id"); 
  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    if (!sessionId || !orderId) return;

    axiosSecure.patch(`/orders/${orderId}/paid`, { sessionId })
      .then(res => {
        console.log("Payment verified:", res.data);
      })
      .catch(err => {
        console.error(err);
      });
  }, [sessionId, orderId]);



  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1 style={{ color: "green" }}>Payment Successful!</h1>
      <p style={{ color: "green" }} >Your payment has been verified.</p>
    </div>
  );
}
