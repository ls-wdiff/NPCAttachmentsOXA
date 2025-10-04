export function get(obj: any, path: `${string}.${string}` | string) {
  return path.split(".").reduce((o, i) => (o || {})[i], obj);
}
