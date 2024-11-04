'use client';

import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { QRCodeSVG } from 'qrcode.react';
import * as htmlToImage from 'html-to-image';
import jsPDF from 'jspdf';
import { EmailIcon, FacebookIcon, FacebookShareButton, TwitterIcon, TwitterShareButton } from 'react-share';

interface ReceiptDetails {
    receiptId: string;
    propertyTitle: string;
    amountPaid: number;
    date: string;
    userName: string;
    userEmail: string;
    propertyLocation: string;
    transactionId: string;
}

interface EReceiptProps {
    details: ReceiptDetails;
}

const EReceipt: React.FC<EReceiptProps> = ({ details }) => {
    const receiptRef = useRef<HTMLDivElement | null>(null);

    // Handle printing
    const handlePrint = useReactToPrint({
        content: () => receiptRef.current,
    });

    // Handle download as image
    const handleDownloadImage = async () => {
        if (receiptRef.current) {
            const dataUrl = await htmlToImage.toPng(receiptRef.current);
            const link = document.createElement('a');
            link.href = dataUrl;
            link.download = `receipt-${details.receiptId}.png`;
            link.click();
        }
    };

    // Handle download as PDF
    const handleDownloadPDF = () => {
        if (receiptRef.current) {
            htmlToImage.toPng(receiptRef.current).then((imgData) => {
                const pdf = new jsPDF();
                pdf.addImage(imgData, 'PNG', 10, 10, 190, 260);
                pdf.save(`receipt-${details.receiptId}.pdf`);
            });
        }
    };

    return (
        <div className="w-full mt-8 bg-white rounded-lg">
            {/* Receipt Content */}
            <div ref={receiptRef} className="py-4 bg-gray-50 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold mb-4">E-Receipt</h2>
                <p className="text-sm text-gray-600">Receipt ID: {details.receiptId}</p>
                <p className="text-sm text-gray-600">Transaction ID: {details.transactionId}</p>
                <hr className="my-3" />

                <div className="mb-4">
                    <h3 className="text-lg font-bold">{details.propertyTitle}</h3>
                    <p className="text-gray-700">Location: {details.propertyLocation}</p>
                    <p className="text-gray-700">Amount Paid: ${details.amountPaid}</p>
                    <p className="text-gray-700">Payment Date: {details.date}</p>
                </div>

                <div className="mb-4">
                    <h4 className="font-bold">Billed To:</h4>
                    <p>{details.userName}</p>
                    <p>{details.userEmail}</p>
                </div>

                {/* QR Code */}
                <div className="flex justify-center mb-4">
                    <QRCodeSVG value={`https://example.com/receipt/${details.receiptId}`} size={128} />
                </div>

                <p className="text-xs text-gray-500">
                    Scan the QR code for more details or visit: <a href={`https://example.com/receipt/${details.receiptId}`} className="text-blue-500 underline">View Receipt</a>
                </p>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between mt-6">
                {/* Print Button */}
                <button
                    onClick={handlePrint}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-600 transition"
                >
                    Print
                </button>

                {/* Download as Image */}
                <button
                    onClick={handleDownloadImage}
                    className="bg-green-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-green-600 transition"
                >
                    Download Image
                </button>

                {/* Download as PDF */}
                <button
                    onClick={handleDownloadPDF}
                    className="bg-purple-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-purple-600 transition"
                >
                    Download PDF
                </button>
            </div>

            {/* Social Sharing */}
            <div className="mt-6">
                <h4 className="text-md font-semibold mb-2">Share Receipt:</h4>
                <div className="flex gap-4">
                    <FacebookShareButton url={`https://example.com/receipt/${details.receiptId}`}>
                        <FacebookIcon size={32} round />
                    </FacebookShareButton>
                    <TwitterShareButton url={`https://example.com/receipt/${details.receiptId}`}>
                        <TwitterIcon size={32} round />
                    </TwitterShareButton>
                    <a href={`mailto:?subject=Receipt%20${details.receiptId}&body=Here%20is%20your%20receipt%20link%3A%20https%3A%2F%2Fexample.com%2Freceipt%2F${details.receiptId}`}>
                        <EmailIcon size={32} round />
                    </a>
                </div>
            </div>
        </div>
    );
};

export default EReceipt;
