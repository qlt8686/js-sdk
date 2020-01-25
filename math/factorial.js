export default function factorial(n, total = 1) {
  return n <= 1 ? total : factorial(n - 1, n * total);
}
