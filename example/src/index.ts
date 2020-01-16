import { add } from './other'

console.log(add(100, 200))

function fibonacci(x: number): number {
    return x <= 1 ? x : fibonacci(x - 1) + fibonacci(x - 2)
}
console.log(fibonacci(15))
