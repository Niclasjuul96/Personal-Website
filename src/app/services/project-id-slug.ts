/**
 * Shared by ProjectsService and ProjectVisibilityService. Doc IDs are built
 * as "<baseId>-<slugified title>" (e.g. "1-chat-app") purely for
 * readability in the Firebase console — every actual lookup keys off just
 * the leading segment before the first "-" (see extractProjectId), so a
 * later title change can't break an existing reference to a project by id.
 */
export function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function buildDocId(baseId: string, title: string): string {
  const slug = slugify(title);
  return slug ? `${baseId}-${slug}` : baseId;
}

export function extractProjectId(docId: string): string {
  return docId.split('-')[0];
}
