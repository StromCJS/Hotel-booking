import React, { useState } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { AnimatedButton } from './AnimatedButton';
import { ArrowLeft, Check, CreditCard, User, Mail, Phone } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface BookingFlowProps {
  room: any;
  onClose: () => void;
  onBookingComplete: (booking: any) => void;
}

const BookingFlow: React.FC<BookingFlowProps> = ({ room, onClose, onBookingComplete }) => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    checkInDate: '',
    checkOutDate: '',
    guests: 1,
    specialRequests: '',
    guestName: '',
    guestEmail: '',
    guestPhone: '',
  });

  const steps = [
    { id: 1, title: 'Select Dates', icon: User },
    { id: 2, title: 'Guest Details', icon: Mail },
    { id: 3, title: 'Payment', icon: CreditCard },
    { id: 4, title: 'Confirmation', icon: Check },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    // Handle booking submission
    try {
      // API call would go here
      const booking = {
        ...formData,
        roomId: room.id,
        userId: user?.id,
        totalPrice: room.price * calculateNights(),
      };
      onBookingComplete(booking);
    } catch (error) {
      console.error('Booking failed:', error);
    }
  };

  const calculateNights = () => {
    if (!formData.checkInDate || !formData.checkOutDate) return 0;
    const checkIn = new Date(formData.checkInDate);
    const checkOut = new Date(formData.checkOutDate);
    return Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Select Your Dates</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Check-in Date</label>
                <input
                  type="date"
                  name="checkInDate"
                  value={formData.checkInDate}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Check-out Date</label>
                <input
                  type="date"
                  name="checkOutDate"
                  value={formData.checkOutDate}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                  min={formData.checkInDate || new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Number of Guests</label>
              <input
                type="number"
                name="guests"
                value={formData.guests}
                onChange={handleInputChange}
                min="1"
                max={room.capacity}
                className="w-full p-2 border rounded-md"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Guest Details</h3>
            <div>
              <label className="block text-sm font-medium mb-2">Full Name</label>
              <input
                type="text"
                name="guestName"
                value={formData.guestName}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
                placeholder="Enter your full name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                name="guestEmail"
                value={formData.guestEmail}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Phone</label>
              <input
                type="tel"
                name="guestPhone"
                value={formData.guestPhone}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
                placeholder="Enter your phone number"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Special Requests (Optional)</label>
              <textarea
                name="specialRequests"
                value={formData.specialRequests}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
                rows={3}
                placeholder="Any special requests or notes..."
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Payment Information</h3>
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="flex justify-between items-center mb-2">
                <span>Room: {room.roomNumber} - {room.type}</span>
                <span>${room.price} × {calculateNights()} nights</span>
              </div>
              <div className="flex justify-between items-center font-semibold text-lg">
                <span>Total:</span>
                <span>${room.price * calculateNights()}</span>
              </div>
            </div>
            <div className="border p-4 rounded-md">
              <p className="text-sm text-gray-600 mb-2">Secure payment powered by Stripe</p>
              {/* Stripe CardElement would go here */}
              <div className="bg-white border p-3 rounded">
                Card details form would be implemented here
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold">Booking Confirmed!</h3>
            <p className="text-gray-600">
              Your booking has been successfully confirmed. You will receive a confirmation email shortly.
            </p>
            <div className="bg-gray-50 p-4 rounded-md text-left">
              <h4 className="font-medium mb-2">Booking Details:</h4>
              <p>Room: {room.roomNumber} - {room.type}</p>
              <p>Check-in: {formData.checkInDate}</p>
              <p>Check-out: {formData.checkOutDate}</p>
              <p>Guests: {formData.guests}</p>
              <p>Total: ${room.price * calculateNights()}</p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Complete Your Booking</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-between mb-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={step.id} className="flex items-center">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                    currentStep >= step.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className={`ml-2 text-sm ${
                    currentStep >= step.id ? 'text-blue-600 font-medium' : 'text-gray-600'
                  }`}>
                    {step.title}
                  </span>
                  {index < steps.length - 1 && (
                    <div className={`w-12 h-0.5 mx-4 ${
                      currentStep > step.id ? 'bg-blue-600' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>

          {/* Step Content */}
          <div className="mb-6">
            {renderStepContent()}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <button
              onClick={currentStep === 1 ? onClose : handlePrevious}
              className="flex items-center px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {currentStep === 1 ? 'Cancel' : 'Previous'}
            </button>

            {currentStep < steps.length ? (
              <AnimatedButton
                onClick={handleNext}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Next
              </AnimatedButton>
            ) : (
              <AnimatedButton
                onClick={handleSubmit}
                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Confirm Booking
              </AnimatedButton>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingFlow;
