import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { messagingApi } from "../../api/messagingApi";
import { getApiErrorMessage } from "../../lib/apiError";

// Otvara (ili nastavlja postojeci) razgovor sa vlasnikom o ovom oglasu.
export function ContactOwnerButton({ listingId }: { listingId: number }) {
  const navigate = useNavigate();
  const [isStarting, setIsStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    setIsStarting(true);
    setError(null);
    try {
      const conversation = await messagingApi.startConversation(listingId);
      navigate(`/messages/${conversation.id}`);
    } catch (err) {
      setError(getApiErrorMessage(err));
      setIsStarting(false);
    }
  }

  return (
    <>
      <button type="button" className="btn btn--primary" onClick={handleClick} disabled={isStarting}>
        {isStarting ? "Otvaranje..." : "Pošalji poruku vlasniku"}
      </button>
      {error && <span className="detail__action-error">{error}</span>}
    </>
  );
}
