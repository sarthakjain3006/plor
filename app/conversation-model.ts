export type Side = "from" | "to";
export type MessageId = number;
export type LayerId = number;
export type ChatId = number;

export type Message = {
  id: MessageId;
  side: Side;
  text: string;
  time: string;
  kind?: "message" | "tool";
  label?: string;
  code?: string;
};

export type ConversationLayer = {
  id: LayerId;
  messageIds: MessageId[];
  parentId?: LayerId;
  anchorMessageId?: MessageId;
};

export type MessagesById = Record<MessageId, Message>;

export type Chat = {
  id: ChatId;
  title: string;
  rootLayerId: LayerId;
  layerPath: LayerId[];
  updatedAt: string;
};

export const starterMessagesById: MessagesById = {
  101: { id: 101, side: "from", text: "How do I branch a conversation in Plor?", time: "10:02 AM" },
  102: { id: 102, side: "to", text: "Click any message bubble to open a focused branch from that exact point. Try the three questions in this tour—each one leads somewhere different without losing this root conversation.", time: "10:03 AM" },
  103: { id: 103, side: "from", text: "Why branch instead of starting another chat?", time: "10:04 AM" },
  104: { id: 104, side: "to", text: "Branches keep an exploration attached to the context that inspired it. Open this question to see the product motivation and the design tradeoffs behind that choice.", time: "10:05 AM" },
  105: { id: 105, side: "from", text: "How do I understand the whole conversation tree?", time: "10:06 AM" },
  106: { id: 106, side: "to", text: "The page stack shows local depth; Overview shows the complete graph. Open this question for a tour of navigation, depth cues, and returning to earlier ideas.", time: "10:07 AM" },

  201: { id: 201, side: "to", text: "You are now in a child branch. The message you clicked becomes the first message here, so the new context always has a clear origin.", time: "10:08 AM" },
  202: { id: 202, side: "from", text: "What happens to the original conversation when I branch?", time: "10:09 AM" },
  203: { id: 203, side: "to", text: "It stays untouched. This branch can develop independently while the parent remains available behind it. Click your follow-up above to create the nested branch in this showcase.", time: "10:10 AM" },

  301: { id: 301, side: "to", text: "A new chat is useful for a new objective. A branch is better for an alternative, question, or experiment that depends on a particular moment in the current discussion.", time: "10:11 AM" },
  302: { id: 302, side: "to", text: "The core design choice is non-destructive exploration: you can compare directions without copying context, rewriting history, or crowding the main thread with side quests.", time: "10:12 AM" },
  303: { id: 303, side: "to", text: "That is also why the interface resembles layered pages. Each branch should feel connected to its source while remaining a distinct place you can revisit.", time: "10:13 AM" },

  401: { id: 401, side: "to", text: "Use the back arrow to move up one level. The tapered pages around the active conversation show how deep you are without taking attention away from the current task.", time: "10:14 AM" },
  402: { id: 402, side: "to", text: "Overview opens the complete conversation map, where sibling branches sit side by side and nested branches appear one level lower.", time: "10:15 AM", kind: "tool", label: "Conversation map", code: "Root tour\n├─ How branching works\n│  └─ What happens to the parent\n├─ Why branching exists\n└─ How to navigate the tree" },
  403: { id: 403, side: "to", text: "Select any node in Overview to jump directly to it. Together, the page stack and graph provide local orientation and a global map of the same conversation.", time: "10:16 AM" },

  501: { id: 501, side: "to", text: "This is a sub-branch: a branch created from inside another branch. Its path is root → branching tutorial → parent-conversation question.", time: "10:17 AM" },
  502: { id: 502, side: "to", text: "The parent branch is still preserved one page back, and the original tour is two levels back. The page taper grows with depth to make that relationship visible.", time: "10:18 AM", kind: "tool", label: "Branch path", code: "Explore branching in Plor\n  / How branching works\n    / What happens to the parent" },
  503: { id: 503, side: "to", text: "Use Back to climb one level at a time, or open Overview to move anywhere in the tree immediately.", time: "10:19 AM" },
};

export const starterLayers: ConversationLayer[] = [
  { id: 10, messageIds: [101, 102, 103, 104, 105, 106] },
  { id: 20, parentId: 10, anchorMessageId: 101, messageIds: [101, 201, 202, 203] },
  { id: 30, parentId: 10, anchorMessageId: 103, messageIds: [103, 301, 302, 303] },
  { id: 40, parentId: 10, anchorMessageId: 105, messageIds: [105, 401, 402, 403] },
  { id: 50, parentId: 20, anchorMessageId: 202, messageIds: [202, 501, 502, 503] },
];

export const starterLayerPath = [10];

export const starterChats: Chat[] = [{
  id: 1,
  title: "Explore branching in Plor",
  rootLayerId: 10,
  layerPath: starterLayerPath,
  updatedAt: "10:19 AM",
}];

export const messageTimeFormatter = new Intl.DateTimeFormat("en", {
  hour: "numeric",
  minute: "2-digit",
});

export function childLayerKey(parentId: LayerId, anchorMessageId: MessageId) {
  return `${parentId}:${anchorMessageId}`;
}
