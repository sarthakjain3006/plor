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
  101: { id: 101, side: "from", text: "Make the project settings easier to scan without changing any behavior.", time: "10:02 AM" },
  102: { id: 102, side: "to", text: "I'll trace the current settings flow, identify shared components, and keep the change scoped to presentation.", time: "10:03 AM" },
  201: { id: 201, side: "to", text: "The route uses four panels, repeated section headings, and one shared save action.", time: "10:06 AM", kind: "tool", label: "Explored settings", code: "app/settings/page.tsx\ncomponents/settings-nav.tsx\ncomponents/settings-form.tsx\nlib/preferences.ts" },
  202: { id: 202, side: "to", text: "The safest improvement is a denser section layout with the existing form boundaries left intact.", time: "10:07 AM" },
  301: { id: 301, side: "from", text: "Keep the navigation compact. Most people use this on a laptop.", time: "10:09 AM" },
  302: { id: 302, side: "to", text: "I'll use a narrow section rail on desktop and collapse it into a menu at smaller widths.", time: "10:10 AM" },
  401: { id: 401, side: "to", text: "The compact layout is in place. Account and workspace controls are grouped, while billing remains separate.", time: "10:16 AM" },
  402: { id: 402, side: "to", text: "Updated the page structure and responsive styles without changing form state or validation.", time: "10:17 AM", kind: "tool", label: "Edited 2 files", code: "app/settings/page.tsx       +42 -18\napp/settings/settings.css   +31 -12" },
  501: { id: 501, side: "from", text: "Can save feedback stay visible while moving between sections?", time: "10:20 AM" },
  502: { id: 502, side: "to", text: "Yes. I'll lift save status into the shared settings shell and add coverage for navigation during a request.", time: "10:21 AM" },
  601: { id: 601, side: "to", text: "Save feedback now persists across sections and resolves in place when the request finishes.", time: "10:28 AM" },
  602: { id: 602, side: "to", text: "The focused tests, keyboard pass, and production build all complete successfully.", time: "10:29 AM", kind: "tool", label: "Checks passed", code: "OK settings flow (8 tests)\nOK keyboard navigation (4 tests)\nOK production build" },
};

export const starterLayers: ConversationLayer[] = [
  { id: 10, messageIds: [101, 102] },
  { id: 20, parentId: 10, anchorMessageId: 101, messageIds: [101, 201, 202] },
  { id: 30, parentId: 20, anchorMessageId: 202, messageIds: [202, 301, 302] },
  { id: 40, parentId: 30, anchorMessageId: 301, messageIds: [301, 401, 402] },
  { id: 50, parentId: 40, anchorMessageId: 402, messageIds: [402, 501, 502] },
  { id: 60, parentId: 50, anchorMessageId: 501, messageIds: [501, 601, 602] },
];

export const starterLayerPath = starterLayers.map((layer) => layer.id);

export const starterChats: Chat[] = [{
  id: 1,
  title: "Refine project settings",
  rootLayerId: 10,
  layerPath: starterLayerPath,
  updatedAt: "10:29 AM",
}];

export const messageTimeFormatter = new Intl.DateTimeFormat("en", {
  hour: "numeric",
  minute: "2-digit",
});

export function childLayerKey(parentId: LayerId, anchorMessageId: MessageId) {
  return `${parentId}:${anchorMessageId}`;
}
