import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { messagingApi } from "../api/messagingApi";
import { ChatPanel } from "../components/messages/ChatPanel";
import { ConversationList } from "../components/messages/ConversationList";
import { usePolledData } from "../hooks/usePolledData";
import { getApiErrorMessage } from "../lib/apiError";
import type { Conversation } from "../types/messaging";

const LIST_POLL_INTERVAL_MS = 15000;

async function fetchConversations() {
  return messagingApi.getConversations();
}

export function MessagesPage() {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const activeId = conversationId ? Number(conversationId) : null;

  const { data: conversations, error, isLoading, refresh } = usePolledData(fetchConversations, LIST_POLL_INTERVAL_MS);

  // Razgovor otvoren direktnim linkom moze da nedostaje u listi (npr. nov razgovor bez poruka
  // koji lista jos nije osvezila), pa se tada dohvata posebno.
  const listed = conversations?.find((conversation) => conversation.id === activeId) ?? null;
  const [fetched, setFetched] = useState<{ id: number; conversation: Conversation | null; error: string | null } | null>(null);

  useEffect(() => {
    if (activeId == null || !conversations || listed) return;
    let cancelled = false;
    messagingApi.getConversation(activeId).then(
      (conversation) => {
        if (!cancelled) setFetched({ id: activeId, conversation, error: null });
      },
      (err: unknown) => {
        if (!cancelled) setFetched({ id: activeId, conversation: null, error: getApiErrorMessage(err) });
      }
    );
    return () => {
      cancelled = true;
    };
  }, [activeId, conversations, listed]);

  const activeFallback = fetched?.id === activeId ? fetched : null;
  const activeConversation = listed ?? activeFallback?.conversation ?? null;

  const handleDeleted = useCallback(() => {
    refresh();
    navigate("/messages", { replace: true });
  }, [navigate, refresh]);

  return (
    <>
      <h1 className="page-title">Poruke</h1>

      {error && !conversations && <div className="alert alert--error">{error}</div>}
      {isLoading && <p>Učitavanje...</p>}

      {conversations && conversations.length === 0 && activeId == null && (
        <div className="empty">
          <p>Još nemaš razgovora. Otvori oglas i klikni „Pošalji poruku vlasniku“.</p>
          <Link to="/" className="btn btn--primary">
            Pregledaj oglase
          </Link>
        </div>
      )}

      {conversations && (conversations.length > 0 || activeId != null) && (
        <div className={`messenger${activeId != null ? " has-active" : ""}`}>
          <aside className="messenger__sidebar">
            {conversations.length > 0 ? (
              <ConversationList conversations={conversations} activeId={activeId} />
            ) : (
              <p className="messenger__placeholder">Nema drugih razgovora.</p>
            )}
          </aside>

          <div className="messenger__main">
            {activeConversation ? (
              <ChatPanel
                key={activeConversation.id}
                conversation={activeConversation}
                onActivity={refresh}
                onDeleted={handleDeleted}
              />
            ) : activeFallback?.error ? (
              <div className="messenger__placeholder">
                <div className="alert alert--error">{activeFallback.error}</div>
              </div>
            ) : activeId != null ? (
              <p className="messenger__placeholder">Učitavanje razgovora...</p>
            ) : (
              <p className="messenger__placeholder">Izaberi razgovor sa leve strane.</p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
