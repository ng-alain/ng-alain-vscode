export interface LessToCssResult {
  filePath: string;
  nodes: LessToCssNode[];
}

export interface LessToCssNode {
  name: string;
  comment?: string;
  default?: string;
}
