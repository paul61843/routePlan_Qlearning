export const pipe = (...fns) => x => fns.reduce((y, f) => f(y), x); 

export const convertDecimalNum = (fixedNum) => (num) => {
    return Number(num.toFixed(fixedNum));
}