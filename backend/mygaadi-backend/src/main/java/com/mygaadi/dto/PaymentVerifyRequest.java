package com.mygaadi.dto;

public class PaymentVerifyRequest {
    public Long buyerId;
    public Long carId;
    public String razorpayOrderId;
    public String razorpayPaymentId;
    public String razorpaySignature;
}
