import React from "react";
import Link from "next/link";

export default function Button({ token, userId, creatorId, eventId, bookEventHandler }) {
    return (
      <React.Fragment>
        {token ? (
          creatorId == userId ? (
            <button className="btn">مناسبتي</button>
          ) : (
            <button
              className="btn"
              onClick={() => bookEventHandler({ variables: { eventId } })}
            >
              احجز
            </button>
          )
        ) : (
          <Link href={"/login"} passHref>
            <button className="btn">سجل دخول لتحجز</button>
          </Link>
        )}
      </React.Fragment>
    );
}
  