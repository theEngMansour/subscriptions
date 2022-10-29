import React, { useState } from "react";
import { useRouter } from "next/router";
import { useQuery, useMutation, useApolloClient } from "@apollo/client";
import { BOOKINGS } from "hooks/queries";
import { CANCEL_BOOKING } from "hooks/mutations";

export default function Booking() {
    const router = useRouter();
    const [alert, setAlert] = useState("");
    const { loading, error, data } = useQuery(BOOKINGS);

    const [cancelBooking] = useMutation(CANCEL_BOOKING, {
        onError: (error) => setAlert(error.message),
        onCompleted: () => {
            setAlert("تم إلغاء حجزك");
        },
    });

    // refetch queries after create events
    const client = useApolloClient();
    client.refetchQueries({
        include: ["Bookings"],
    });

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error.message}</p>;

    return (
        <React.Fragment>
            <h1>{alert}</h1>
            <button onClick={() => router.push('/events')}>Back</button>
            {data.bookings.map((booking) => (
                <div key={booking.id}>
                <li>
                    {booking.event.title} -{" "}
                    {new Date(booking.createdAt).toLocaleDateString()} -{" "}
                    {booking.event.price}$
                    <button
                    onClick={() =>
                        cancelBooking({ variables: { bookingId: booking.id } })
                    }
                    >
                    cancelBooking
                    </button>
                </li>
                </div>
            ))}
        </React.Fragment>
    );
}
