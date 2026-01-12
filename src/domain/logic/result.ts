/**
 * Result<T> - Railway Oriented Programming Pattern
 * 
 * Represents the result of an operation that can either succeed or fail.
 * This pattern makes error handling explicit and composable.
 */
export class Result<T> {
    public readonly isSuccess: boolean;
    public readonly error?: string;
    private readonly _value?: T;

    private constructor(isSuccess: boolean, error?: string, value?: T) {
        this.isSuccess = isSuccess;
        this.error = error;
        this._value = value;

        if (isSuccess && error) {
            throw new Error('InvalidOperation: A result cannot be successful and contain an error');
        }
        if (!isSuccess && !error) {
            throw new Error('InvalidOperation: A failing result needs to contain an error message');
        }
    }

    /**
     * Get the value of a successful result
     * @throws Error if the result is a failure
     */
    public getValue(): T {
        if (!this.isSuccess) {
            throw new Error("Can't get the value of an error result. Use 'error' instead.");
        }
        return this._value as T;
    }

    /**
     * Check if the result is a failure
     */
    public get isFailure(): boolean {
        return !this.isSuccess;
    }

    /**
     * Create a successful result
     */
    public static ok<U>(value?: U): Result<U> {
        return new Result<U>(true, undefined, value);
    }

    /**
     * Create a failed result
     */
    public static fail<U>(error: string): Result<U> {
        return new Result<U>(false, error);
    }

    /**
     * Combine multiple results - fails if any result fails
     */
    public static combine<U>(results: Result<U>[]): Result<U[]> {
        const failed = results.find(r => r.isFailure);
        if (failed) {
            return Result.fail(failed.error!);
        }

        const values = results.map(r => r.getValue());
        return Result.ok(values);
    }

    /**
     * Map the value of a successful result
     */
    public map<U>(fn: (value: T) => U): Result<U> {
        if (this.isFailure) {
            return Result.fail(this.error!);
        }

        try {
            const mapped = fn(this.getValue());
            return Result.ok(mapped);
        } catch (error) {
            return Result.fail(error instanceof Error ? error.message : String(error));
        }
    }

    /**
     * Chain operations that return Results (flatMap/bind)
     */
    public bind<U>(fn: (value: T) => Result<U>): Result<U> {
        if (this.isFailure) {
            return Result.fail(this.error!);
        }

        try {
            return fn(this.getValue());
        } catch (error) {
            return Result.fail(error instanceof Error ? error.message : String(error));
        }
    }

    /**
     * Execute a side effect if the result is successful
     */
    public onSuccess(fn: (value: T) => void): Result<T> {
        if (this.isSuccess) {
            fn(this.getValue());
        }
        return this;
    }

    /**
     * Execute a side effect if the result is a failure
     */
    public onFailure(fn: (error: string) => void): Result<T> {
        if (this.isFailure) {
            fn(this.error!);
        }
        return this;
    }
}
