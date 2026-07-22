import type { ConversationLayer, LayerId } from "./conversation-model";

export type GraphNode = ConversationLayer & { depth: number; x: number; y: number };

export type GraphLayout = {
  nodes: GraphNode[];
  nodesById: Map<LayerId, GraphNode>;
  width: number;
  height: number;
};

export function layoutLayers(layers: ConversationLayer[]): GraphLayout {
  const layersById = new Map(layers.map((layer) => [layer.id, layer]));
  const childrenByParent = new Map<LayerId, ConversationLayer[]>();

  for (const layer of layers) {
    if (!layer.parentId || !layersById.has(layer.parentId)) continue;
    const children = childrenByParent.get(layer.parentId) ?? [];
    children.push(layer);
    childrenByParent.set(layer.parentId, children);
  }

  const positions = new Map<LayerId, { depth: number; x: number }>();
  const visited = new Set<LayerId>();
  let nextLeaf = 0;

  function positionSubtree(layer: ConversationLayer, depth: number): number {
    if (visited.has(layer.id)) return positions.get(layer.id)?.x ?? nextLeaf * 240;
    visited.add(layer.id);
    const childPositions = (childrenByParent.get(layer.id) ?? [])
      .map((child) => positionSubtree(child, depth + 1));
    const x = childPositions.length
      ? childPositions.reduce((sum, childX) => sum + childX, 0) / childPositions.length
      : nextLeaf++ * 240;
    positions.set(layer.id, { depth, x });
    return x;
  }

  const roots = layers.filter((layer) => !layer.parentId || !layersById.has(layer.parentId));
  roots.forEach((root, index) => {
    positionSubtree(root, 0);
    if (index < roots.length - 1) nextLeaf += .5;
  });
  layers.filter((layer) => !visited.has(layer.id))
    .forEach((layer) => positionSubtree(layer, 0));

  const rawNodes: GraphNode[] = layers.map((layer) => {
    const position = positions.get(layer.id) ?? { depth: 0, x: 0 };
    return { ...layer, depth: position.depth, x: position.x, y: 42 + position.depth * 132 };
  });
  const minX = Math.min(0, ...rawNodes.map((layer) => layer.x));
  const maxX = Math.max(184, ...rawNodes.map((layer) => layer.x + 184));
  const contentWidth = maxX - minX;
  const width = Math.max(760, contentWidth + 88);
  const horizontalShift = (width - contentWidth) / 2 - minX;
  const nodes = rawNodes.map((layer) => ({ ...layer, x: layer.x + horizontalShift }));
  const maxDepth = Math.max(0, ...nodes.map((layer) => layer.depth));

  return {
    nodes,
    nodesById: new Map(nodes.map((layer) => [layer.id, layer])),
    width,
    height: Math.max(420, 160 + maxDepth * 132),
  };
}
