import { useState, useEffect } from "react";
import {
  decryptMessage,
  shortTimeStamp,
} from "components/apps/Messenger/functions";
import { FOCUSABLE_ELEMENT, MILLISECONDS_IN_MINUTE } from "utils/constants";
import { type Event } from "nostr-tools";
import { useNostrProfile } from "components/apps/Messenger/hooks";
import { Avatar } from "components/apps/Messenger/Icons";

type ContactProps = {
  lastEvent: Event;
  onClick: () => void;
  pubkey: string;
  publicKey: string;
  recipientPublicKey: string;
};

const Contact: FC<ContactProps> = ({
  lastEvent,
  onClick,
  pubkey,
  publicKey,
  recipientPublicKey,
}) => {
  const { content = "", created_at = 0, pubkey: eventPubkey } = lastEvent || {};
  const [decryptedContent, setDecryptedContent] = useState("");
  const [timeStamp, setTimeStamp] = useState("");
  const { picture, userName } = useNostrProfile(pubkey);

  useEffect(() => {
    if (content) {
      decryptMessage(content, pubkey).then(setDecryptedContent);
    }
  }, [content, pubkey]);

  useEffect(() => {
    let interval = 0;

    if (created_at) {
      setTimeStamp(shortTimeStamp(created_at));

      interval = window.setInterval(
        () => setTimeStamp(shortTimeStamp(created_at)),
        MILLISECONDS_IN_MINUTE
      );
    }

    return () => window.clearInterval(interval);
  }, [created_at, lastEvent]);

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
    <li
      className={recipientPublicKey === pubkey ? "selected" : undefined}
      {...FOCUSABLE_ELEMENT}
      onClick={onClick}
    >
      <figure>
        {picture ? <img alt={userName} src={picture} /> : <Avatar />}
        <figcaption>
          <span>{userName}</span>
          <div>
            <div>
              {eventPubkey === publicKey ? "You: " : ""}
              {decryptedContent || content}
            </div>
            {timeStamp ? "·" : ""}
            <div>{timeStamp}</div>
          </div>
        </figcaption>
      </figure>
    </li>
  );
};

export default Contact;