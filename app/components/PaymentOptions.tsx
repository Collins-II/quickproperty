"use client";

import React, { useState } from "react";
import { FaMobileAlt, FaCreditCard } from "react-icons/fa";
import { BsCash } from "react-icons/bs";
import { networkTypes } from "../data";
import Image from "next/image";

type PaymentMethod = "mobile" | "visa" | "cash";

interface PaymentOptionsProps {
  onPaymentMethodSelect: (method: PaymentMethod) => void;
  onPaymentSubmit: (paymentDetails: any) => void;
}

const PaymentOptions: React.FC<PaymentOptionsProps> = ({
  onPaymentMethodSelect,
  onPaymentSubmit,
}) => {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [network, setNetwork] = useState<"airtel" | "mtn" | "zamtel" | null>(null);
  const [mobileNumber, setMobileNumber] = useState<string>("");
  const [cardDetails, setCardDetails] = useState({ number: "", expiry: "", cvv: "" });

  const handleMethodSelect = (method: PaymentMethod) => {
    setSelectedMethod(method);
    onPaymentMethodSelect(method);
  };

  const handleSubmit = () => {
    const details: any = { method: selectedMethod };
    if (selectedMethod === "mobile" && network && mobileNumber) {
      details.network = network;
      details.mobileNumber = mobileNumber;
    } else if (selectedMethod === "visa" && cardDetails.number && cardDetails.expiry && cardDetails.cvv) {
      details.cardDetails = cardDetails;
    } else if (selectedMethod === "cash") {
      details.method = "cash";
    }
    onPaymentSubmit(details);
  };

  return (
    <div className="w-full rounded-lg bg-white">
      <h2 className="text-xl font-semibold text-center mb-6">Select Payment Method</h2>

      {/* Payment Method Buttons */}
      <div className="flex gap-4 mb-6 justify-center">
        <button
          onClick={() => handleMethodSelect("mobile")}
          className={`flex flex-col items-center gap-2 p-4 rounded-md w-28 border transition ${
            selectedMethod === "mobile" ? "border-green-500 bg-green-50" : "border-gray-300"
          } hover:shadow-md`}
        >
          <FaMobileAlt size={28} className={selectedMethod === "mobile" ? "text-green-500" : "text-gray-500"} />
          <span className="text-sm font-medium">Mobile Money</span>
        </button>

        <button
          onClick={() => handleMethodSelect("visa")}
          className={`flex flex-col items-center gap-2 p-4 rounded-md w-28 border transition ${
            selectedMethod === "visa" ? "border-blue-500 bg-blue-50" : "border-gray-300"
          } hover:shadow-md`}
        >
          <FaCreditCard size={28} className={selectedMethod === "visa" ? "text-blue-500" : "text-gray-500"} />
          <span className="text-sm font-medium">Visa Card</span>
        </button>

        <button
          onClick={() => handleMethodSelect("cash")}
          className={`flex flex-col items-center gap-2 p-4 rounded-md w-28 border transition ${
            selectedMethod === "cash" ? "border-yellow-500 bg-yellow-50" : "border-gray-300"
          } hover:shadow-md`}
        >
          <BsCash size={28} className={selectedMethod === "cash" ? "text-yellow-500" : "text-gray-500"} />
          <span className="text-sm font-medium">Cash</span>
        </button>
      </div>

      {/* Conditional Inputs for Selected Method */}
      {selectedMethod === "mobile" && (
        <div className="mb-4">
          <h3 className="text-md font-semibold mb-2">Select Network</h3>
          <div className="flex gap-4 mb-4">
            {networkTypes.map((networkOption,i) => (
              <button
                key={i}
                onClick={() => setNetwork(networkOption.label as "airtel" | "mtn" | "zamtel")}
                className={`flex flex-col items-center justify-center gap-5 py-2 px-4 rounded-md ${
                  network === networkOption.label ? "bg-neutral-200 text-slate-900" : "bg-white"
                }`}
              >
                <Image src={networkOption.logo} width={80} height={80} alt={networkOption.label} className="rounded-xl object-cover"/>
                {networkOption.label.charAt(0).toUpperCase() + networkOption.label.slice(1)}
              </button>
            ))}
          </div>
          <label className="block text-sm font-medium mb-1 capitalize" htmlFor="mobileNumber">
            {network ? network :"Mobile"} Number
          </label>
          <input
            id="mobileNumber"
            type="text"
            disabled={!network} // Explicitly set disabled prop
            value={mobileNumber}
            onChange={(e) => setMobileNumber(e.target.value)}
            className="w-full p-2 border border-[0.5px] border-green-300 rounded focus:border-[0.5px] focus:border-neutral-200 focus:ring-neutral-500"
            placeholder="Enter Mobile Number"
          />
        </div>
      )}

      {selectedMethod === "visa" && (
        <div className="space-y-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="cardNumber">
              Card Number
            </label>
            <input
              id="cardNumber"
              type="text"
              value={cardDetails.number}
              onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded focus:border-blue-500 focus:ring-blue-500"
              placeholder="Enter Card Number"
            />
          </div>
          <div className="flex gap-4">
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="expiry">
                Expiry Date
              </label>
              <input
                id="expiry"
                type="text"
                value={cardDetails.expiry}
                onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded focus:border-blue-500 focus:ring-blue-500"
                placeholder="MM/YY"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="cvv">
                CVV
              </label>
              <input
                id="cvv"
                type="password"
                value={cardDetails.cvv}
                onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded focus:border-blue-500 focus:ring-blue-500"
                placeholder="CVV"
              />
            </div>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        className="w-full py-3 rounded-md bg-blue-600 text-white font-semibold text-center transition hover:bg-blue-700"
      >
        Confirm Payment
      </button>
    </div>
  );
};

export default PaymentOptions;
