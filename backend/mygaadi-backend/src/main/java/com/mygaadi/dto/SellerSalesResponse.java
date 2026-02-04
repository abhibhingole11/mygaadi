package com.mygaadi.dto;

import java.time.LocalDateTime;

public class SellerSalesResponse {
    public Long transactionId;
    public String carMake;
    public String carModel;
    public double carPrice;
    public String buyerName;
    public String buyerEmail;
    public String buyerPhone;
    public LocalDateTime purchasedAt;
}
