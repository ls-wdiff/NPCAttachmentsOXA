import { Struct } from "s2cfgtojson";

type Context<T> = {
  fileIndex: number;
  index: number;
  array: T[];
  extraStructs: T[];
  filePath: string;
  structsById: Record<string, T>;
};

export type Meta<T> = {
  changenote: string;
  interestingFiles: string[];
  description: string;
  entriesTransformer?(entries: T, context: Context<T>): Struct | null; // prefer getEntriesTransformer
  getEntriesTransformer?(context: { filePath: string }): (struct: T, context: Context<T>) => T | null; // use this to transform entries
  interestingContents?: string[];
  interestingIds?: string[];
  prohibitedIds?: string[];
  onFinish?(): void;
};
