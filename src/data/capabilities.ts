export interface CapabilityNode {
  id: string;
  label: string;
  relatedProjects: string[];
  connections: string[];
}

export const capabilities: CapabilityNode[] = [];
