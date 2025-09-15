import { z } from 'zod';
export declare const urlnullableIntegerSchema: (fieldName: string) => z.ZodPipe<z.ZodString, z.ZodTransform<number | null, string>>;
export declare const urlIntegerSchema: (fieldName: string) => z.ZodPipe<z.ZodString, z.ZodTransform<number, string>>;
/************************* */
/************************* */
export declare const nonNullableNumberSchema: (fieldName: string) => z.ZodNumber;
export declare const nullableNumberSchema: (fieldName: string) => z.ZodNullable<z.ZodNumber>;
/************************* */
/************************* */
export declare const nonNullableIntegerSchema: (fieldName: string) => z.ZodNumber;
export declare const nullableIntegerSchema: (fieldName: string) => z.ZodNullable<z.ZodNumber>;
/******************************** */
/******************************** */
export declare const nonNullablePositifStrictIntegerSchema: (fieldName: string) => z.ZodNumber;
export declare const nullablePositifStrictIntegerSchema: (fieldName: string) => z.ZodNullable<z.ZodNumber>;
/******************************** */
/******************************** */
export declare const nonNullablePositifIntegerSchema: (fieldName: string) => z.ZodNumber;
export declare const nullablePositifIntegerSchema: (fieldName: string) => z.ZodNullable<z.ZodNumber>;
/************************* */
/************************* */
export declare const nonNullableDecimalSchema: (fieldName: string, maxDecimal: number) => z.ZodNumber;
export declare const nullableDecimalSchema: (fieldName: string, maxDecimal: number) => z.ZodNullable<z.ZodNumber>;
/**************************************** */
/**************************************** */
export declare const nonNullablePositifStrictDecimalSchema: (fieldName: string, maxDecimal: number) => z.ZodPipe<z.ZodTransform<unknown, unknown>, z.ZodNumber>;
export declare const nullablePositifStrictDecimalSchema: (fieldName: string, maxDecimal: number) => z.ZodPipe<z.ZodTransform<{} | null, unknown>, z.ZodNullable<z.ZodNumber>>;
/********************************** */
/********************************** */
export declare const nonNullablePositifDecimalSchema: (fieldName: string, maxDecimal: number) => z.ZodPipe<z.ZodTransform<unknown, unknown>, z.ZodNumber>;
export declare const nullablePositifDecimalSchema: (fieldName: string, maxDecimal: number) => z.ZodPipe<z.ZodTransform<{} | null, unknown>, z.ZodNullable<z.ZodNumber>>;
/********************************** */
/********************************** */
export declare const nonNullableBooleanSchema: (fieldName: string) => z.ZodBoolean;
export declare const idsQuerySchema: (fieldName: string) => z.ZodObject<{
    ids: z.ZodPipe<z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodArray<z.ZodString>]>, z.ZodTransform<string[], string | string[]>>, z.ZodTransform<number[], string[]>>;
}, z.core.$strip>;
export declare const undefinedDateIsoSchema: (fieldName: string) => z.ZodPipe<z.ZodString, z.ZodTransform<string | undefined, string>>;
export declare const dateIsoSchema: (fieldName: string) => z.ZodPipe<z.ZodString, z.ZodTransform<string, string>>;
