import * as React from "react";
import * as App from "./ArtBookingFormApp";
import { Bookings } from "./ArtBookings";
import { useState, useEffect } from "react";
import { sp } from "@pnp/sp";

export const HomePage = (props) => {
  const [bookings, setBookings] = useState([]);
  const [status, setStatus] = useState("ready");
  const [isDisabledNewBookBtn, setIsDisabledNewBookBtn] = useState(false);
  const [activeBookingDate, setActiveBookingDate] = useState(null);
  const fetchData = async () => {
    try {
      setStatus("loading");
      await App.getBookings(props.listName).then((bookingsList) => {
        console.log(bookingsList);
        setBookings(bookingsList);
      });
      setStatus("ready");
    } catch (e) {
      setStatus("error");
    }
  };
  const updateNewBooking = () => {
    fetchData();
  };
  useEffect(() => {
    sp.setup({
      spfxContext: props.context,
    });
    fetchData();
  }, []);
  return (
    <div>
      <Bookings
        updateNewBooking={updateNewBooking}
        listName={props.listName}
        bookings={bookings}
        status={status}
        isFormAvailable={!isDisabledNewBookBtn}
      />
    </div>
  );
};
