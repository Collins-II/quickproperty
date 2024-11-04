"use client";
import React, { useRef } from "react";
import { useProperty } from "../../context/PropertyContext";
import { useSession } from "next-auth/react";
import { useReactToPrint } from "react-to-print";
import { QRCodeSVG } from "qrcode.react";
import * as htmlToImage from "html-to-image";
import jsPDF from "jspdf";
import { IoMdClose } from "react-icons/io";
import { FiPhone, FiMail, FiMessageSquare } from "react-icons/fi";
import { receiptDetails } from "@/app/data";
import { useViewContext } from "@/app/context/ViewReserveContext";
import { useReschedule } from "@/app/context/RescheduleContext";

interface ReservedModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ReservedModal: React.FC<ReservedModalProps> = ({ isOpen, onClose }) => {
  const { data: session } = useSession();
  const user = session?.user;
  const { selectedPropertyView } = useViewContext();
  const { isModalOpenRes,setSelectedPropertyRes, setIsModalOpenRes } = useReschedule();

  if (!isOpen || !selectedPropertyView) return null;

  const url = "https://yourpropertylisting.com/property/12345";
  const title = "Check out this amazing property!";
  const receiptRef = useRef<HTMLDivElement | null>(null);

  const handlePrint = useReactToPrint({
    content: () => receiptRef.current,
  });

  const handleDownloadImage = async () => {
    if (receiptRef.current) {
      const dataUrl = await htmlToImage.toPng(receiptRef.current);
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `receipt-${receiptDetails.receiptId}.png`;
      link.click();
    }
  };

  const handleDownloadPDF = () => {
    if (receiptRef.current) {
      htmlToImage.toPng(receiptRef.current).then((imgData) => {
        const pdf = new jsPDF();
        pdf.addImage(imgData, "PNG", 10, 10, 190, 260);
        pdf.save(`receipt-${receiptDetails.receiptId}.pdf`);
      });
    }
  };

  const status = {
    confirmed: "Confirmed",
    paid: "Paid",
    unpaid: "Unpaid",
    pending: "Pending",
  };

  let currentStatus = status.pending;

  const handleRescheduleClick = () => {
    setSelectedPropertyRes(selectedPropertyView); // Set the property to the context
    setIsModalOpenRes(true); // Open the modal
};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30 duration-500">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg max-h-[100vh] lg:max-h-[90vh] overflow-y-scroll showed-scroll-bar">
        <div className="flex justify-end mb-4">
          <button className="p-1 border-0 hover:opacity-70 transition" onClick={onClose}>
            <IoMdClose size={20} />
          </button>
        </div>

        <h2 className="text-2xl font-semibold mb-6 text-center text-slate-900">
          Reservation Details
        </h2>

        {/* Property Info */}
        <div className="my-4">
          <img
            src={selectedPropertyView.imageSrc[0]}
            alt={selectedPropertyView.title}
            className="w-full h-48 object-cover rounded-md mb-4"
          />
          <h3 className="text-lg font-bold text-gray-800 mb-1">{selectedPropertyView.title}</h3>
          <p className="text-md text-gray-600 font-medium">{selectedPropertyView.property_type}</p>
          <p className="text-md text-gray-500">
            {selectedPropertyView.compound}, {selectedPropertyView.province}
          </p>
          <p className="text-md text-slate-900 font-semibold mt-2">Price: ZMW {selectedPropertyView.price}</p>
        </div>

        <hr className="my-4" />
 {/* Host Contact Details */}
 <div className="text-md text-gray-700 mb-4">
          <h3 className="text-lg font-semibold text-slate-800 mb-2">Host Contact Information</h3>
          <div className="flex items-center space-x-2">
            <FiPhone className="text-gray-500" />
            <span className="font-semibold">Phone:</span>{" "}
            <a href={`tel: 260973302063`} className="text-blue-500 underline">
              {"260973302063" || "N/A"}
            </a>
          </div>
          <div className="flex items-center space-x-2 mt-2">
            <FiMail className="text-gray-500" />
            <span className="font-semibold">Email:</span>{" "}
            <a href={`mailto:${user?.email}`} className="text-blue-500 underline">
              {user?.email || "N/A"}
            </a>
          </div>
        </div>
        <hr className="my-4" />
        {/* Appointment & Payment Details */}
        <div className="text-md text-gray-700 space-y-1">
        <h3 className="text-lg font-semibold text-slate-800 mb-2">Appointment details</h3>
          <div className="flex justify-between items-center">
            <span className="font-semibold">Date:</span>
            <span>{"12th December, 2023" || "N/A"}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-semibold">Time:</span>
            <span>{"3:00 PM" || "N/A"}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-semibold">Status:</span>
            <span className={`${currentStatus === "Confirmed" ? "text-green-600" : "text-red-600"} font-medium`}>
              {currentStatus || "Pending"}
            </span>
          </div>
          <hr className="my-4" />
          <div className="flex justify-between items-center">
            <span className="font-semibold">Payment Status:</span>
            <span className={`${status.paid === "Paid" ? "text-green-600" : "text-red-600"} font-medium`}>
              {status.paid || "Unpaid"}
            </span>
          </div>
        </div>

        <hr className="mb-4 mt-2" />

        {/* QR Code */}
        <div className="flex justify-center mb-4">
          <QRCodeSVG value={`https://example.com/receipt/${receiptDetails.receiptId}`} size={128} />
        </div>
        <p className="text-xs text-gray-500">
          Scan the QR code for more details or visit:{" "}
          <a href={`https://example.com/receipt/${receiptDetails.receiptId}`} className="text-blue-500 underline">
            View Receipt
          </a>
        </p>

        <hr className="my-4" />

        {/* Action Buttons */}
        <div className="flex gap-4 mt-6">
          <button
            onClick={handlePrint}
            className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-600 transition"
          >
            Print
          </button>
          <button
            onClick={handleDownloadPDF}
            className="bg-purple-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-purple-600 transition"
          >
            Download PDF
          </button>
        </div>

        <div className="flex justify-between gap-4 mt-6">
          <button onClick={handleRescheduleClick} className="flex-1 py-2 px-4 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition">
            Reschedule
          </button>
          <button
            onClick={() => window.open(`mailto:${user?.email}`, "_blank")}
            className="flex-1 py-2 px-4 bg-gray-600 text-white font-semibold rounded-md hover:bg-gray-700 transition flex items-center justify-center"
          >
            <FiMessageSquare className="mr-2" />
            Message Host
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReservedModal;
