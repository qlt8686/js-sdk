import factorial from "./factorial";

export default function poisson(lamda, x) {
  return (Math.E ** -lamda * lamda ** x) / factorial(x);
}
