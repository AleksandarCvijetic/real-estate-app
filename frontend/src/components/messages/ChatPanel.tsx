import { useCallback, useEffect, useLayoutEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { Link } from "react-router-dom";
import { messagingApi } from "../../api/messagingApi";
import { useAuth } from "../../context/AuthContext";
import { useLookup } from "../../hooks/useLookup";
import { usePolledData } from "../../hooks/usePolledData";
import { getApiErrorMessage } from "../../lib/apiError";
import { formatMessageTime, formatPrice } from "../../lib/format";
import { lookupCache } from "../../lib/lookupCache";
import { resolveImageUrl } from "../../lib/imageUrl";
import type { Conversation, Message } from "../../types/messaging";

const POLL_INTERVAL_MS = 5000;
const MAX_LENGTH = 2000;

interface ChatPanelProps {
  conversation: Conversation;
  // Poziva se kad se promeni nesto sto utice na listu razgovora (poslata/procitana poruka).
  onActivity: () => void;
  onDeleted: () => void;
}

export function ChatPanel({ conversation, onActivity, onDeleted }: ChatPanelProps) {
  const { user } = useAuth();
  const listing = useLookup(conversation.listingId, lookupCache.getListing);
  const otherUser = useLookup(conversation.otherUserId, lookupCache.getUser);

  const fetchMessages = useCallback(() => messagingApi.getMessages(conversation.id), [conversation.id]);
  const { data, error: loadError, isLoading, refresh } = usePolledData(fetchMessages, POLL_INTERVAL_MS);

  // Poslate poruke se prikazuju odmah, dok ih sledece ucitavanje ne vrati sa servera.
  const [sent, setSent] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const serverIds = new Set((data ?? []).map((message) => message.id));
  const messages = [...(data ?? []), ...sent.filter((message) => !serverIds.has(message.id))];

  // Neprocitane poruke sagovornika se oznacavaju kao procitane cim stignu u otvoren razgovor.
  const lastMarkedIdRef = useRef<number | null>(null);
  const lastUnread = [...(data ?? [])]
    .reverse()
    .find((message) => message.senderId !== user?.id && message.status === "SENT");

  useEffect(() => {
    if (!lastUnread || lastMarkedIdRef.current === lastUnread.id) return;
    lastMarkedIdRef.current = lastUnread.id;
    messagingApi.markAsRead(conversation.id).then(onActivity, () => undefined);
  }, [lastUnread, conversation.id, onActivity]);

  // Automatsko skrolovanje na dno kad stigne nova poruka.
  const scrollRef = useRef<HTMLDivElement>(null);
  const lastMessageId = messages.at(-1)?.id;
  useLayoutEffect(() => {
    const element = scrollRef.current;
    if (element) element.scrollTop = element.scrollHeight;
  }, [lastMessageId]);

  async function send(event?: FormEvent) {
    event?.preventDefault();
    const text = draft.trim();
    if (!text || isSending) return;

    setIsSending(true);
    setError(null);
    try {
      const message = await messagingApi.sendMessage(conversation.id, text);
      setSent((current) => [...current, message]);
      setDraft("");
      refresh();
      onActivity();
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setIsSending(false);
    }
  }

  // Enter salje, Shift+Enter prelazi u novi red.
  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault();
      void send();
    }
  }

  async function handleDelete() {
    if (!window.confirm("Razgovor će biti uklonjen iz tvoje liste. Ako ti sagovornik ponovo piše, vratiće se.")) {
      return;
    }
    try {
      await messagingApi.deleteConversation(conversation.id);
      onDeleted();
    } catch (err) {
      setError(getApiErrorMessage(err));
    }
  }

  const cover = listing?.images[0];

  return (
    <section className="chat">
      <header className="chat__header">
        <Link to="/messages" className="chat__back" aria-label="Nazad na razgovore">
          ←
        </Link>
        <div className="chat__thumb">
          {cover ? <img src={resolveImageUrl(cover.url)} alt="" /> : <span aria-hidden="true">🏠</span>}
        </div>
        <div className="chat__heading">
          <span className="chat__name">
            {otherUser ? `${otherUser.firstName} ${otherUser.lastName}` : " "}
          </span>
          {listing === null ? (
            <span className="chat__listing">Oglas više nije dostupan</span>
          ) : listing ? (
            <Link to={`/listings/${listing.id}`} className="chat__listing">
              {listing.title} · {formatPrice(listing.price)}
            </Link>
          ) : null}
        </div>
        <button type="button" className="btn btn--ghost btn--danger btn--small" onClick={handleDelete}>
          Obriši
        </button>
      </header>

      <div className="chat__messages" ref={scrollRef}>
        {isLoading && <p className="chat__hint">Učitavanje poruka...</p>}
        {data && messages.length === 0 && (
          <p className="chat__hint">Još nema poruka. Napiši prvu poruku u vezi sa oglasom.</p>
        )}
        {messages.map((message) => {
          const isMine = message.senderId === user?.id;
          return (
            <div key={message.id} className={`chat-bubble${isMine ? " chat-bubble--mine" : ""}`}>
              <p className="chat-bubble__text">{message.text}</p>
              <span className="chat-bubble__meta">
                {formatMessageTime(message.sentAt)}
                {isMine && (message.status === "READ" ? " · Pročitano" : " · Poslato")}
              </span>
            </div>
          );
        })}
      </div>

      {(error ?? loadError) && <div className="alert alert--error chat__error">{error ?? loadError}</div>}

      <form className="chat__composer" onSubmit={send}>
        <textarea
          className="control chat__input"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Napiši poruku..."
          rows={2}
          maxLength={MAX_LENGTH}
          aria-label="Poruka"
        />
        <button type="submit" className="btn btn--primary" disabled={isSending || !draft.trim()}>
          {isSending ? "Slanje..." : "Pošalji"}
        </button>
      </form>
    </section>
  );
}
