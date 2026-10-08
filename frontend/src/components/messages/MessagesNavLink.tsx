import { NavLink } from "react-router-dom";
import { messagingApi } from "../../api/messagingApi";
import { usePolledData } from "../../hooks/usePolledData";

const POLL_INTERVAL_MS = 30000;

async function fetchConversations() {
  return messagingApi.getConversations();
}

// Link u headeru sa ukupnim brojem neprocitanih poruka. Renderuje se samo za prijavljenog korisnika.
export function MessagesNavLink() {
  const { data } = usePolledData(fetchConversations, POLL_INTERVAL_MS);
  const unread = (data ?? []).reduce((sum, conversation) => sum + conversation.unreadCount, 0);

  return (
    <NavLink to="/messages" className="nav-with-badge">
      Poruke
      {unread > 0 && (
        <span className="unread-badge" aria-label={`${unread} nepročitanih`}>
          {unread}
        </span>
      )}
    </NavLink>
  );
}
