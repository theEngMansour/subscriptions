import Link from 'next/link';
import { useContext } from 'react';
import { useQuery, useApolloClient } from "@apollo/client";
import { EVENTS} from "hooks/queries";
import { AuthContext } from "contexts";

export default function Index() {
    const { userId } = useContext(AuthContext)
    const { loading, error, data } = useQuery(EVENTS);
    
    // refetch queries after create events
    const client = useApolloClient()
    client.refetchQueries({
        include: ["Events"],
    })

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error.message}</p>;
    
    return data.events.map(({ id, title, price, date, creatorId}) => (
        <div key={id}>
        <h3>{title}</h3>
        <b>About this location:</b>
        <p>{price}</p>
        <p>{date}</p>
        <Link href={`/events/${id}`} passHref>
            <button className='btn'>
                {userId === creatorId ? "أنت صاحب هذه المناسبة" : "عرض التفاصيل"}
            </button>
        </Link>
        <br />
        </div>
    ));
}