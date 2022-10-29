import React from "react";
import prisma from "lib/prisma";
import { useQuery, useMutation } from "@apollo/client";
import { GET_EVENT } from "hooks/queries";
import { BOOK_EVENT } from "hooks/mutations";
import { useState, useContext } from "react";
import { AuthContext } from "contexts";
import { Button } from "components";

export default function Show({ params }) {
  const [alert, setAlert] = useState()
  const { token, userId } = useContext(AuthContext);
  const { loading, error, data } = useQuery(GET_EVENT, {
    variables: { eventId: params?.id },
  });

  const [bookEventHandler] = useMutation(BOOK_EVENT, {
    onError: (error) => {
      setAlert(error.message);
    },
    onCompleted: () => {
      setAlert("تم حجز المناسبة بنجاح")
    },
  });

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1>{alert}</h1>
      <h1>{data?.getIdEvents?.title}</h1>
      <h5>{data?.getIdEvents?.description}</h5>
      <li>{data?.getIdEvents?.price}</li>
      <li>{data?.getIdEvents?.date}</li>
      <p>{data?.getIdEvents?.creator?.username}</p>
      <Button
        token={token}
        userId={userId}
        creatorId={data?.getIdEvents?.creatorId}
        eventId={data?.getIdEvents?.id}
        bookEventHandler={bookEventHandler}
      />
    </div>
  );
}

export async function getStaticPaths() {
  const items = await prisma.event.findMany();
  const paths = items.map((e) => ({ params: { id: e.id.toString() } }));
  return {
    paths,
    fallback: true, // Reload any id new for events added
  };
}

export async function getStaticProps({ params }) {
  return { props: { params } };
}
