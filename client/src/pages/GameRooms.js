import React, { useState, useEffect } from 'react';
import {QRCodeCanvas} from 'qrcode.react'; // Import the QRCode component from qrcode.react
import '../styles/GameRooms.css';
import { useUser } from '../UserContext';

const GameRooms = () => {
    const user = useUser();
    const userAID = user?.uid;
    const [events, setEvents] = useState([]);
    const [activeEvent, setActiveEvent] = useState(null);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [paymentReference, setPaymentReference] = useState(''); // State to store payment reference ID
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

        const fetchActiveEvent = async () => {
            try {
                if(userAID!== null){
                    const response = await fetch(`https://aura-gaming.onrender.com/api/users/active-events/${userAID}`);
                    const activeEve = await response.json();
                    if (activeEve.length > 0) {
                        try {
                            const response = await fetch(`https://aura-gaming.onrender.com/api/events/${activeEve[0].eventID}`);
                            if (response.ok) {
                              const data = await response.json();
                              setActiveEvent(data);
                            }
                        }catch (err) {
                            console.error('Error fetching event data:', err);
                        }
                    }
                }
                
            } catch (err) {
                console.error('Error fetching active events:', err);
            }
        };
        fetchActiveEvent();

    }, [userAID]);

    

    const handleRegisterClick = (event) => {
        setSelectedEvent(event);
        setIsPopupVisible(true);
        setErrorMessage('');
    };

    const handleProceedClick = async () => {
        if (selectedEvent.fee !== 0 && paymentReference.trim() === '') {
            setErrorMessage('❗Payment reference ID is required.');
                return;
        } 
        try {
            const response = await fetch('https://aura-gaming.onrender.com/api/events/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    eventID: selectedEvent.eventID,
                    userAID,
                    paymentReference, // Include the payment reference ID in the request
                }),
            });

            const data = await response.json();

            if (response.ok) {
                alert(response.status);
            } else {
                alert(data.message);
            }
            closePopup();
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
            <br/>
            {activeEvent && (
                <div className="active-event-card">
                    <div className="active-event-card-content">
                        <img src={activeEvent.bannerImage} alt={activeEvent.title} className="active-event-image" />
                        <div className="active-event-timing">
                            <p>Starts: </p>
                            <h7>{activeEvent.timing}</h7>
                        </div>
                        <div className="active-event-button">
                            <a href={`/game-rooms/${activeEvent.eventID}`} className="active-event-redirect-button">
                            Enter Room
                            </a>
                        </div>
                    </div>
                </div>
            )}
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
                                    Learn More
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
                                <div className="divider2"></div> 
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
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter') {
                                          handleProceedClick();
                                        }
                                      }}
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
