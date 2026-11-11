export function riyal(n: number): string {
  return `${new Intl.NumberFormat("en-US").format(n)} ر.س`;
}
