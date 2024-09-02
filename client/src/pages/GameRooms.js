import React, { useState, useEffect } from 'react';
import {QRCodeCanvas} from 'qrcode.react'; // Import the QRCode component from qrcode.react
import '../styles/GameRooms.css';
import { getAuth } from "firebase/auth";

const auth = getAuth();

const GameRooms = () => {
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [paymentReference, setPaymentReference] = useState(''); // State to store payment reference ID
    const [userID, setUserID] = useState(null); // State to store the user's ID
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('https://aura-gaming.onrender.com/api/events/');
                if (!response.ok) throw new Error('Network response was not ok');
                const data = await response.json();
                setEvents(data);
            } catch (err) {
                console.error('Error fetching events:', err);
            }
        };

        fetchData();

        // Set the user ID from Firebase auth
        const user = auth.currentUser;
        if (user) {
            setUserID(user.uid);
        }
    }, []);

    const handleRegisterClick = (event) => {
        setSelectedEvent(event);
        setIsPopupVisible(true);
        setErrorMessage('');
    };

    const handleProceedClick = async () => {
        if (selectedEvent.fee === 0) {
            try {
                const response = await fetch('https://aura-gaming.onrender.com/api/events/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ eventID: selectedEvent.eventID, userID }),
                });

                const data = await response.json();

                if (response.ok) {
                    alert('Successfully registered!');
                    closePopup();
                } else {
                    alert(data.message);
                }
            } catch (err) {
                console.error('Error registering user:', err);
            }
        } else {
            // If the event is paid, show the payment input fields
            if (paymentReference.trim() === '') {
                setErrorMessage('❗Payment reference ID is required.');
                return;
            }
            handlePaymentSubmission();
        }
    };

    const handlePaymentSubmission = async () => {
        try {
            const response = await fetch('https://aura-gaming.onrender.com/api/events/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    eventID: selectedEvent.eventID,
                    userID,
                    paymentReference, // Include the payment reference ID in the request
                }),
            });

            const data = await response.json();

            if (response.ok) {
                alert('Registration in processing. We will confirm your payment shortly.');
                closePopup();
            } else {
                alert(data.message);
            }
        } catch (err) {
            console.error('Error submitting payment:', err);
        }
    };

    const closePopup = () => {
        setIsPopupVisible(false);
        setSelectedEvent(null);
        setPaymentReference('');
        setErrorMessage('');
    };

    

    return (
        <div className="game-rooms">
            <br />
            <h1>Upcoming Games</h1>
            <br />
            <div className={events.length > 0 ? "event-cards" : ""}>
                {events.length > 0 ? (
                    events.map((event, index) => (
                        <div key={index} className="event-card">
                            <img src={event.bannerImage} alt={event.title} className="event-banner" />
                            <div className="event-details">
                                <p><strong>Host:</strong> {event.hostname}</p>
                                <p><strong>-</strong> {event.description}</p>
                                <p><strong>Starts: </strong> {event.timing}</p>
                                <button 
                                    className="register-button" 
                                    onClick={() => handleRegisterClick(event)}>
                                    Register
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className='no-events'>
                        <br />
                        <h3>We ran out of events?🤔</h3>
                        <h5>Nah Probably the Hosts just sleeping!😴</h5>
                        <br />
                        <h1>💤</h1>
                        <h1>🛌</h1>
                    </p>
                )}
            </div>
            <br />

            {isPopupVisible && selectedEvent && (
                <div className="popup-overlay">
                    <div className="popup-content">
                        <button className="close-button" onClick={closePopup}>✖</button>
                        <br/>
                        <h2>{selectedEvent.title}</h2>
                        <p><strong>Host:</strong> {selectedEvent.hostname}</p>
                        <p><strong>Description:</strong> {selectedEvent.description}</p>
                        <p><strong>Starts:</strong> {selectedEvent.timing}</p>
                        <p><strong>Event Type:</strong> {selectedEvent.eventType}</p>
                        <p><strong>Participation Type:</strong> {selectedEvent.participationType}</p>
                        <p><strong>Fee:</strong> {selectedEvent.fee === 0 ? 'Free' : `₹${selectedEvent.fee}`}</p>
                        
                        {selectedEvent.fee > 0 && (
                            <div className="payment-section">
                                <br/>
                                <div className="divider"></div> 
                                <h4>Pay using UPI</h4>
                                
                                <div className="qrcode-container">
                                    <QRCodeCanvas value={`upi://pay?pa=gouravag11@icici&pn=Aura Gaming&am=${selectedEvent.fee}&cu=INR&tn=${encodeURIComponent(selectedEvent.eventID)}`} size={200} />
                                </div>
                                <p>Scan the QR code above to pay ₹{selectedEvent.fee}</p>
                                <input 
                                    type="text" 
                                    placeholder="Enter Payment Reference ID" 
                                    value={paymentReference} 
                                    onChange={(e) => setPaymentReference(e.target.value)} 
                                    required 
                                />
                                {errorMessage && <p className="error-message">{errorMessage}</p>}
                            </div>
                        )}

                        <button className="proceed-button" onClick={handleProceedClick}>
                            {selectedEvent.fee === 0 ? 'Register for free' : 'Proceed'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GameRooms;
