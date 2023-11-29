import React, { useEffect } from "react";
import axios from "axios";
import {
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { Helmet } from "react-helmet";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLocation, useNavigate } from "react-router-dom";

const Payment = () => {
  const [money, setMoney] = useState(0);
  const [content, setContent] = useState("");
  const token = localStorage.getItem("token");
  const location = useLocation();
  const navigate = useNavigate();

  const paymentId = "";
  const payerId = "";

  const handlePriceChange = (event) => {
    setMoney(event.target.value);
  };

  const handleContentChange = (event) => {
    setContent(event.target.value);
  };

  const handlePayment = () => {
    const data = {
      price: money,
      description: content,
    };

    axios
      .post(`http://localhost:8080/paypal/pay`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log("cc",response);
        const approvalUrl = response.data;

        if (approvalUrl) {
          // Open the PayPal Payment Link in a new window
          window.open(approvalUrl, "_blank");
          toast.success("Payment link opened successfully!");
        } else {
          // window.alert("Failed to retrieve PayPal Payment Link.");
          toast.error("Failed to retrieve PayPal Payment Link.");
        }
      })
      .catch((error) => {
        console.error(error);
        // window.alert("Error during payment. Please try again.");
        toast.error("Error during payment. Please try again.");
      });
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Helmet>
        <title>Payment</title>
      </Helmet>
      <Card>
        <CardContent>
          <Typography variant="h5" component="div">
            Payment
          </Typography>
          <TextField
            label="Money"
            type="number"
            fullWidth
            value={money}
            onChange={handlePriceChange}

          />
          <TextField
            label="Content"
            fullWidth
            multiline
            value={content}
            onChange={handleContentChange}
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handlePayment}
          >
            Recharge
          </Button>
        </CardContent>
      </Card>
      <ToastContainer />
    </div>
  );
};

export default Payment;