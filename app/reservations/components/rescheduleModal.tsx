'use client';
import React, { useState, useRef } from "react";
import { useProperty } from "../../context/PropertyContext";
import { useSession } from "next-auth/react";
import { useReactToPrint } from 'react-to-print';
import { QRCodeSVG } from 'qrcode.react';
import * as htmlToImage from 'html-to-image';
import jsPDF from 'jspdf';
import { IoMdClose } from "react-icons/io";
import { receiptDetails } from "@/app/data";
import Reschedule from "./reschedule";
import { useReschedule } from "@/app/context/RescheduleContext";

interface RescheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const RescheduleModal: React.FC<RescheduleModalProps> = ({ isOpen, onClose }) => {
  const { data: session } = useSession();
  const user = session?.user;
  const { selectedPropertyRes } = useReschedule();

  // Initial Date and Time from the reservation
  const [initialDate] = useState<Date | null>(new Date()); // Default to current date
  const [initialTime] = useState<string>('12:00'); // Default time for initial setting

  // Updated Date and Time for rescheduling
  const [updatedDate, setUpdatedDate] = useState<Date | null | undefined>(null);
  const [updatedTime, setUpdatedTime] = useState<string | undefined>(undefined);

  const receiptRef = useRef<HTMLDivElement | null>(null);

  // Printing the receipt
  const handlePrint = useReactToPrint({
    content: () => receiptRef.current,
  });

  // Download receipt as an image
  const handleDownloadImage = async () => {
    if (receiptRef.current) {
      const dataUrl = await htmlToImage.toPng(receiptRef.current);
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `receipt-${receiptDetails.receiptId}.png`;
      link.click();
    }
  };

  // Download receipt as PDF
  const handleDownloadPDF = () => {
    if (receiptRef.current) {
      htmlToImage.toPng(receiptRef.current).then((imgData) => {
        const pdf = new jsPDF();
        pdf.addImage(imgData, 'PNG', 10, 10, 190, 260);
        pdf.save(`receipt-${receiptDetails.receiptId}.pdf`);
      });
    }
  };

  // Reschedule submit handler
  const handleSubmitReschedule = () => {
    // Implement submit logic, e.g., updating the appointment date in your API
    if (updatedDate && updatedTime) {
      console.log(`New Date: ${updatedDate}`);
      console.log(`New Time: ${updatedTime}`);
      onClose(); // Close modal after rescheduling
    }
  };

  // Reschedule cancellation handler
  const handleCancelReschedule = () => {
    setUpdatedDate(null);
    setUpdatedTime(undefined);
    onClose(); // Close modal if user cancels
  };

  if (!isOpen || !selectedPropertyRes) return null;

  const status = {
    confirmed: "Confirmed",
    paid: "Paid",
    unpaid: "Unpaid",
    pending: "Pending"
  };

  let currentStatus = status.pending;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30 duration-500">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg max-h-[100vh] lg:max-h-[90vh] overflow-y-scroll showed-scroll-bar">
        <div className="flex justify-end mb-4">
          <button
            className="p-1 border-0 hover:opacity-70 transition"
            onClick={onClose}
          >
            <IoMdClose size={20} />
          </button>
        </div>

        {/* Property Info */}
        <div className="mb-4 text-center">
        <img
            src={selectedPropertyRes.imageSrc[0]}
            alt={selectedPropertyRes.title}
            className="w-full h-48 object-cover rounded-md mb-4"
          />
          <h3 className="text-lg font-semibold">{selectedPropertyRes.title}</h3>
          <p className="text-sm text-gray-600">{selectedPropertyRes.property_type} - {selectedPropertyRes.compound}</p>
          <p className="text-md font-bold text-gray-800">ZMW {selectedPropertyRes.price}</p>
          <p className="text-sm font-light text-gray-500">Status: {currentStatus}</p>
        </div>

        {/* Reschedule Component */}
        <Reschedule
          initialDate={initialDate}
          initialTime={initialTime}
          setUpdatedDate={setUpdatedDate}
          setUpdatedTime={setUpdatedTime}
          onSubmitReschedule={handleSubmitReschedule}
          onCancel={handleCancelReschedule}
        />
      </div>
    </div>
  );
};

export default RescheduleModal;
