'use client';
import React, { useState, useEffect } from 'react';
import { UPIDetails } from '@/lib/types';

interface UPIPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (transactionId: string) => void;
  bookingDetails: {
    date: string;
    time: string;
    amount: number;
  };
}

const UPIPaymentModal: React.FC<UPIPaymentModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  bookingDetails,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');

  useEffect(() => {
    setIsMobile(/Android|iPhone|iPad|iPod/i.test(navigator.userAgent));
    generateQRCode();
  }, []);

  const upiDetails: UPIDetails = {
    vpa: '7009928716@ptsbi', // Replace with your UPI ID
    name: 'Snehdeep Singh',
    amount: bookingDetails.amount,
    transactionNote: `Booking for ${bookingDetails.date} at ${bookingDetails.time}`,
  };

  const generateUPILink = () => {
    return `upi://pay?pa=${upiDetails.vpa}&pn=${encodeURIComponent(
      upiDetails.name
    )}&am=${upiDetails.amount}&tn=${encodeURIComponent(
      upiDetails.transactionNote
    )}`;
  };

  const generateQRCode = async () => {
    const upiLink = generateUPILink();
    // Using a QR code API service
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
      upiLink
    )}`;
    setQrCodeUrl(qrUrl);
  };

  const handlePaymentStart = () => {
    if (isMobile) {
      setIsProcessing(true);
      window.location.href = generateUPILink();
    }
  };

  const handleConfirmPayment = () => {
    onSuccess('MANUAL_CONFIRMATION');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[60]">
      <div className="bg-gray-900 rounded-lg max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-white"
        >
          ✕
        </button>

        <h2 className="text-xl font-semibold text-white mb-4">
          Complete Payment
        </h2>

        <div className="space-y-4">
          <div className="text-gray-300 space-y-2">
            <p>Amount: ₹{bookingDetails.amount}</p>
            <p>Date: {bookingDetails.date}</p>
            <p>Time: {bookingDetails.time}</p>
          </div>

          <div className="text-sm text-gray-400">
            <p>Pay using any UPI app:</p>
            <p className="font-mono mt-1 bg-gray-800 p-2 rounded select-all">
              {upiDetails.vpa}
            </p>
          </div>

          {isMobile ? (
            <button
              onClick={handlePaymentStart}
              disabled={isProcessing}
              className="w-full py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200 disabled:opacity-50"
            >
              Open UPI App
            </button>
          ) : (
            <div className="space-y-2">
              <div className="bg-white p-4 rounded-lg">
                <div className="text-center mb-2 text-gray-900 text-sm">
                  Scan QR code using any UPI app
                </div>
                {qrCodeUrl && (
                  <div className="flex justify-center">
                    <img
                      src={qrCodeUrl}
                      alt="UPI QR Code"
                      className="w-48 h-48"
                    />
                  </div>
                )}
              </div>
              <div className="text-center text-sm text-gray-400">
                Pay using the QR code above or manually use UPI ID
              </div>
            </div>
          )}

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-900 text-gray-400">
                After payment
              </span>
            </div>
          </div>

          <button
            onClick={handleConfirmPayment}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
          >
            I&apos;ve Completed the Payment
          </button>
        </div>
      </div>
    </div>
  );
};

export default UPIPaymentModal;
