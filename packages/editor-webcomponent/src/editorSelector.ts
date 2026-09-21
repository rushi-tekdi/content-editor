import type { EditorPluginInterface } from '@editor/editor-core';
import { ContentEditor } from '@editor/editor-content';

/**
 * Composition point: maps an editorType discriminant to its plugin package.
 * Add a new sub-editor by importing its package here and registering its type key.
 */
export function editorSelector(editorType: string): EditorPluginInterface | null {
  if (editorType === 'content') return new ContentEditor();
  return null;
}
