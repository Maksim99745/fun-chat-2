export function isNotNullable<T>(value: unknown): value is NonNullable<T> {
    return value !== null && value !== undefined;
}

export function isHTMLElement(value: unknown): value is HTMLElement {
    if (value === null || value === undefined) {
        return false;
    }
    return value instanceof HTMLElement;
}

export type ConstructorOf<T> = { new (...args: never[]): T; prototype: T };

export function isInstanceOf<T>(
    elemType: ConstructorOf<T>,
    value: unknown
): value is T {
    return value instanceof elemType;
}

export function isSome<T>(value: unknown): value is NonNullable<T> {
    return value !== null && value !== undefined;
}

export function isSomeFunction<Fn extends (...args: unknown[]) => unknown>(
    value: unknown
): value is NonNullable<Fn> {
    return isSome<Fn>(value) && typeof value === "function";
}

// export const enableButton = (
//     buttonNode: unknown
// ): buttonNode is HTMLElement => {
//     if (isInstanceOf(HTMLButtonElement, buttonNode)) {
//         buttonNode.disabled = false;
//     }
//     return true;
// };

// export const disableButton = (
//     buttonNode: unknown
// ): buttonNode is HTMLElement => {
//     if (isInstanceOf(HTMLButtonElement, buttonNode)) {
//         buttonNode.disabled = true;
//     }
//     return true;
// };

export function assertIsNonNullable<T>(
    value: unknown,
    ...infos: Array<unknown>
): asserts value is NonNullable<T> {
    if (value === undefined || value === null) {
        throw new Error(
            `Nullish assertion Error: "${String(value)}"; ${infos?.join(" ")}`
        );
    }
}

export function assertIsInstanceOf<T>(
    elemType: ConstructorOf<T>,
    value: unknown
): asserts value is T {
    assertIsNonNullable(value, `#${String(elemType)}`);
    if (!(value instanceof elemType)) {
        throw new Error(
            `Not expected value: ${String(value)} of type: "${String(elemType)}"`
        );
    }
}

export const getTimeFromUnix = (secounds: number): string => {
    const date = new Date(secounds);
    const arrDate = [];
    arrDate.push(date.getDate());
    const month = date.getMonth() + 1;
    if (Number(month) < 10) {
        arrDate.push(`0${String(month)}`);
    } else {
        arrDate.push(month);
    }
    arrDate.push(month);
    const year = `${date.getFullYear()}, `;
    arrDate.push(year);
    const dateStr = arrDate.join(".");

    const stringTime = `${`0${date.getHours()}`.slice(-2)}:${`0${date.getMinutes()}`.slice(
        -2
    )}:${`0${date.getSeconds()}`.slice(-2)}`;

    return dateStr + stringTime;
};
