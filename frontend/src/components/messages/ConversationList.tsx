import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useLookup } from "../../hooks/useLookup";
import { formatMessageTime } from "../../lib/format";
import { lookupCache } from "../../lib/lookupCache";
import { resolveImageUrl } from "../../lib/imageUrl";
import type { Conversation } from "../../types/messaging";

interface ConversationListProps {
  conversations: Conversation[];
  activeId: number | null;
}

export function ConversationList({ conversations, activeId }: ConversationListProps) {
  return (
    <ul className="conversation-list">
      {conversations.map((conversation) => (
        <ConversationListItem
          key={conversation.id}
          conversation={conversation}
          isActive={conversation.id === activeId}
        />
      ))}
    </ul>
  );
}

function ConversationListItem({ conversation, isActive }: { conversation: Conversation; isActive: boolean }) {
  const { user } = useAuth();
  const listing = useLookup(conversation.listingId, lookupCache.getListing);
  const otherUser = useLookup(conversation.otherUserId, lookupCache.getUser);

  const cover = listing?.images[0];
  const hasUnread = conversation.unreadCount > 0 && !isActive;
  const preview = conversation.lastMessageText
    ? `${conversation.lastMessageSenderId === user?.id ? "Ti: " : ""}${conversation.lastMessageText}`
    : "Još nema poruka";

  return (
    <li>
      <Link
        to={`/messages/${conversation.id}`}
        className={`conversation-item${isActive ? " is-active" : ""}${hasUnread ? " has-unread" : ""}`}
      >
        <div className="conversation-item__thumb">
          {cover ? <img src={resolveImageUrl(cover.url)} alt="" loading="lazy" /> : <span aria-hidden="true">🏠</span>}
        </div>

        <div className="conversation-item__body">
          <div className="conversation-item__top">
            <span className="conversation-item__name">
              {otherUser ? `${otherUser.firstName} ${otherUser.lastName}` : " "}
            </span>
            {conversation.lastMessageAt && (
              <span className="conversation-item__time">{formatMessageTime(conversation.lastMessageAt)}</span>
            )}
          </div>
          <span className="conversation-item__listing">
            {listing === null ? "Oglas više nije dostupan" : (listing?.title ?? " ")}
          </span>
          <div className="conversation-item__bottom">
            <span className="conversation-item__preview">{preview}</span>
            {hasUnread && <span className="unread-badge">{conversation.unreadCount}</span>}
          </div>
        </div>
      </Link>
    </li>
  );
}
