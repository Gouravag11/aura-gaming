import React from 'react';
import { Carousel } from 'react-bootstrap';

const GameCarousel = () => {
    return (
        <Carousel
            controls={true} // Remove the left/right controls if not needed
            indicators={true} // Remove the indicators below the carousel if not needed
            interval={5000} // Set the time interval between slides (in milliseconds)
            pause={false} // Continue scrolling even if the user hovers over the carousel
            fade={true} // Enable fade transition between slides
            wrap={true} // Enable looping of slides
        >
            <Carousel.Item>
                <img
                    className="d-block w-100"
                    src="images/valo.jpg"
                    alt="Valorant"
                />
                <Carousel.Caption>
                    <h3>Valorant</h3>
                    <p>Join the action in Valorant!</p>
                </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
                <img
                    className="d-block w-100"
                    src="images/pubg.jpg"
                    alt="PUBG"
                />
                <Carousel.Caption>
                    <h3>PUBG</h3>
                    <p>Survive and win in PUBG!</p>
                </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
                <img
                    className="d-block w-100"
                    src="images/apex_legends.jpg"
                    alt="Apex Legends"
                />
                <Carousel.Caption>
                    <h3>Apex Legends</h3>
                    <p>Battle in Apex Legends!</p>
                </Carousel.Caption>
            </Carousel.Item>
        </Carousel>
    );
};

export default GameCarousel;
