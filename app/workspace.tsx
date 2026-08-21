"use client";

import {
  CSSProperties,
  FormEvent,
  lazy,
  MouseEvent,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { flushSync } from "react-dom";
import {
  childLayerKey,
  type Chat,
  type ChatId,
  type ConversationLayer,
  type LayerId,
  type Message,
  messageTimeFormatter,
  starterChats,
  starterLayers,
  starterMessagesById,
  type Side,
} from "./conversation-model";

const ConversationOverview = lazy(() => import("./conversation-overview"));
let nextEntityId = Date.now();
const createEntityId = () => ++nextEntityId;

export default function Workspace() {
  const [messagesById, setMessagesById] = useState(starterMessagesById);
  const [layers, setLayers] = useState(starterLayers);
  const [chats, setChats] = useState(starterChats);
  const [currentChatId, setCurrentChatId] = useState<ChatId>(starterChats[0].id);
  const [side, setSide] = useState<Side>("from");
  const [draft, setDraft] = useState("");
  const [showOverview, setShowOverview] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [transitioningMessage, setTransitioningMessage] = useState<number | null>(null);
  const messagesRef = useRef<HTMLDivElement>(null);

  const layersById = useMemo(
    () => new Map(layers.map((layer) => [layer.id, layer])),
    [layers]
  );
  const chatsById = useMemo(
    () => new Map(chats.map((chat) => [chat.id, chat])),
    [chats]
  );
  const childrenByAnchor = useMemo(() => {
    const index = new Map<string, ConversationLayer>();
    for (const layer of layers) {
      if (layer.parentId && layer.anchorMessageId) {
        index.set(childLayerKey(layer.parentId, layer.anchorMessageId), layer);
      }
    }
    return index;
  }, [layers]);
  const currentChat = chatsById.get(currentChatId) ?? starterChats[0];
  const layerPath = currentChat.layerPath;
  const currentLayerId = layerPath.at(-1) ?? currentChat.rootLayerId;
  const currentLayer = layersById.get(currentLayerId) ?? starterLayers[0];
  const visibleMessages = currentLayer.messageIds
    .map((messageId) => messagesById[messageId])
    .filter((message): message is Message => Boolean(message));
  const depth = layerPath.length - 1;
  const fanWidth = Math.min(depth * 2.2, 10);
  const fanLeft = fanWidth * .12;
  const fanRight = fanWidth - fanLeft;
  const fanBottom = Math.min(depth * 4, 20);

  useEffect(() => {
    messagesRef.current?.scrollTo({ top: 0 });
  }, [currentLayer.id]);

  function updateCurrentPath(update: LayerId[] | ((current: LayerId[]) => LayerId[])) {
    setChats((current) => current.map((chat) => {
      if (chat.id !== currentChat.id) return chat;
      const layerPath = typeof update === "function" ? update(chat.layerPath) : update;
      return { ...chat, layerPath };
    }));
  }

  function openFromMessage(message: Message, event: MouseEvent<HTMLButtonElement>) {
    if (currentLayer.anchorMessageId === message.id) return;

    const openLayer = () => {
      flushSync(() => {
        setTransitioningMessage(message.id);
        const existingLayer = childrenByAnchor.get(childLayerKey(currentLayer.id, message.id));
        if (existingLayer) {
          updateCurrentPath((current) => [...current, existingLayer.id]);
          return;
        }

        const layerId = createEntityId();
        setLayers((current) => [...current, {
          id: layerId,
          parentId: currentLayer.id,
          anchorMessageId: message.id,
          messageIds: [message.id],
        }]);
        updateCurrentPath((current) => [...current, layerId]);
      });
    };
    const transitionDocument = document as Document & {
      startViewTransition?: (callback: () => void) => { finished: Promise<void> };
    };

    if (!transitionDocument.startViewTransition) {
      openLayer();
      window.setTimeout(() => setTransitioningMessage(null), 420);
      return;
    }

    event.currentTarget.style.viewTransitionName = "focused-message";
    const transition = transitionDocument.startViewTransition(openLayer);
    transition.finished.finally(() => setTransitioningMessage(null));
  }

  function closeLayer() {
    if (!depth) return;
    updateCurrentPath((current) => current.slice(0, -1));
  }

  function createChat() {
    const rootLayerId = createEntityId();
    const chat: Chat = {
      id: createEntityId(),
      title: "New chat",
      rootLayerId,
      layerPath: [rootLayerId],
      updatedAt: "Now",
    };
    setLayers((current) => [...current, { id: rootLayerId, messageIds: [] }]);
    setChats((current) => [chat, ...current]);
    setCurrentChatId(chat.id);
    setShowSidebar(false);
  }

  function selectChat(chatId: ChatId) {
    setCurrentChatId(chatId);
    setShowSidebar(false);
  }

  const closeOverview = useCallback(() => setShowOverview(false), []);
  const navigateToLayer = useCallback((layerId: LayerId) => {
    const nextPath: LayerId[] = [];
    let layer = layersById.get(layerId);
    while (layer) {
      nextPath.unshift(layer.id);
      layer = layer.parentId ? layersById.get(layer.parentId) : undefined;
    }
    const rootLayerId = nextPath[0];
    const owner = chats.find((chat) => chat.rootLayerId === rootLayerId);
    if (owner) {
      setChats((current) => current.map((chat) =>
        chat.id === owner.id ? { ...chat, layerPath: nextPath } : chat
      ));
      setCurrentChatId(owner.id);
    }
    setShowOverview(false);
  }, [chats, layersById]);

  function sendMessage(event: FormEvent) {
    event.preventDefault();
    const text = draft.trim();
    if (!text) return;
    const message: Message = {
      id: createEntityId(),
      side,
      text,
      time: messageTimeFormatter.format(new Date()),
    };
    setMessagesById((current) => ({ ...current, [message.id]: message }));
    setLayers((current) => current.map((layer) =>
      layer.id === currentLayer.id
        ? { ...layer, messageIds: [...layer.messageIds, message.id] }
        : layer
    ));
    setChats((current) => current.map((chat) =>
      chat.id === currentChat.id
        ? {
            ...chat,
            title: chat.title === "New chat" ? text.slice(0, 42) : chat.title,
            updatedAt: "Now",
          }
        : chat
    ));
    setDraft("");
  }

  return (
    <main className="app-shell">
      <header className="app-bar">
        <button
          className="sidebar-toggle"
          aria-label="Open chats"
          onClick={() => setShowSidebar(true)}
          type="button"
        >☰</button>
        <div className="brand-mark" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none">
            <g stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M8.5 5.5v11" />
              <path d="M8.5 5.5a5 5 0 0 1 0 10" />
            </g>
            <g fill="currentColor">
              <path d="M8.5 20.6 6.6 16.9h3.8z" />
              <path d="M4.9 15.5 8.5 13.4v4.2z" />
            </g>
          </svg>
        </div>
        <strong>Codex</strong>
        <span className="app-divider" />
        <span className="project-name">plor</span>
        <span className="branch-pill"><span aria-hidden="true">⌁</span> main</span>
      </header>

      <div className="workspace">
        <aside className={`chat-sidebar ${showSidebar ? "open" : ""}`} aria-label="Chats">
          <div className="sidebar-header">
            <strong>Chats</strong>
            <button onClick={createChat} type="button"><span aria-hidden="true">＋</span> New chat</button>
          </div>
          <nav>
            {chats.map((chat) => (
              <button
                className={chat.id === currentChat.id ? "active" : ""}
                key={chat.id}
                onClick={() => selectChat(chat.id)}
                type="button"
              >
                <span>{chat.title}</span>
                <small>{chat.updatedAt}</small>
              </button>
            ))}
          </nav>
        </aside>
        {showSidebar && <button className="sidebar-scrim" aria-label="Close chats" onClick={() => setShowSidebar(false)} type="button" />}
        <section className="agent-workspace" aria-label="Coding agent task">
          <div
            className="chat-stack"
            style={{
              "--stack-left": `${fanLeft}%`,
              "--stack-right": `${fanRight}%`,
              "--stack-bottom": `${fanBottom}px`,
            } as CSSProperties}
          >
            {[...layerPath.slice(1)].reverse().map((layerId, index) => {
              const pageDepth = depth - index;
              const revealRatio = depth ? pageDepth / depth : 0;
              return (
                <div
                  aria-hidden="true"
                  className="paper-layer"
                  key={`${layerId}-${pageDepth}`}
                  style={{
                    "--page-left": `${fanLeft * (1 - revealRatio)}%`,
                    "--page-right": `${fanRight * (1 - revealRatio)}%`,
                    "--page-bottom": `${fanBottom * (1 - revealRatio)}px`,
                  } as CSSProperties}
                />
              );
            })}

            <section className="chat-card" aria-label="Agent conversation">
              <header className="chat-header">
                <button
                  className="icon-button"
                  aria-label={depth ? "Back to previous context" : "Back"}
                  disabled={!depth}
                  onClick={closeLayer}
                  type="button"
                >←</button>
                <div className="task-copy">
                  <h1>{currentChat.title}</h1>
                  <p><span className="status-dot" /> Ready <span>·</span> Local</p>
                </div>
                <div className="task-actions">
                  {depth > 0 && <span className="depth-label">{depth} {depth === 1 ? "layer" : "layers"} deep</span>}
                  <button className="overview-button" onClick={() => setShowOverview(true)} type="button">
                    <span className="overview-glyph" aria-hidden="true"><i /><i /><i /></span>
                    Overview
                  </button>
                </div>
              </header>

              <div
                className={`messages ${depth ? "nested-window" : ""}`}
                aria-live="polite"
                key={currentLayer.id}
                ref={messagesRef}
              >
                <div className="session-marker"><span>Today</span><small>Task started in local workspace</small></div>
                {!visibleMessages.length && (
                  <div className="empty-conversation">
                    <span aria-hidden="true">›_</span>
                    <strong>Start a new task</strong>
                    <p>Describe what you want to build or change.</p>
                  </div>
                )}
                {visibleMessages.map((message) => {
                  const isAnchor = currentLayer.anchorMessageId === message.id;
                  return (
                    <article className={`message-row ${message.side} ${message.kind ?? "message"}`} key={message.id}>
                      <div className="message-content">
                        <div className="message-meta">
                          <strong>{message.side === "from" ? "You" : "Codex"}</strong>
                          <span>{message.time}</span>
                        </div>
                        <button
                          aria-disabled={isAnchor}
                          className={`bubble ${isAnchor ? "layer-root" : ""}`}
                          onClick={(event) => openFromMessage(message, event)}
                          style={
                            transitioningMessage === message.id
                              ? ({ viewTransitionName: "focused-message" } as CSSProperties)
                              : undefined
                          }
                          type="button"
                        >
                          {message.kind === "tool" && (
                            <span className="tool-heading"><span className="checkmark">✓</span>{message.label}</span>
                          )}
                          <span>{message.text}</span>
                          {message.code && <code>{message.code}</code>}
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>

              <div className="composer-area">
                <form className="composer" onSubmit={sendMessage}>
                  <input
                    aria-label={`Message from ${side === "from" ? "you" : "Codex"}`}
                    autoComplete="off"
                    data-chat-input
                    onChange={(event) => setDraft(event.target.value)}
                    placeholder="Ask Codex to change your code"
                    value={draft}
                  />
                  <div className="composer-toolbar">
                    <div className="author-toggle" role="group" aria-label="Message author">
                      <button className={side === "from" ? "active" : ""} onClick={() => setSide("from")} type="button">You</button>
                      <button className={side === "to" ? "active" : ""} onClick={() => setSide("to")} type="button">Agent</button>
                    </div>
                    <button className="send-button" disabled={!draft.trim()} aria-label="Send message">↑</button>
                  </div>
                </form>
              </div>
            </section>
          </div>
        </section>
      </div>

      {showOverview && (
        <Suspense fallback={<div className="overview-loading" role="status">Loading conversation map...</div>}>
          <ConversationOverview
            currentLayerId={currentLayer.id}
            layerPath={layerPath}
            layers={layers}
            messagesById={messagesById}
            onClose={closeOverview}
            onNavigate={navigateToLayer}
          />
        </Suspense>
      )}
    </main>
  );
}
