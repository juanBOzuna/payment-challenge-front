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

    public getValue(): T {
        if (!this.isSuccess) {
            throw new Error("Can't get the value of an error result. Use 'error' instead.");
        }
        return this._value as T;
    }

    public get isFailure(): boolean {
        return !this.isSuccess;
    }

    public static ok<U>(value?: U): Result<U> {
        return new Result<U>(true, undefined, value);
    }

    public static fail<U>(error: string): Result<U> {
        return new Result<U>(false, error);
    }

    public static combine<U>(results: Result<U>[]): Result<U[]> {
        const failed = results.find(r => r.isFailure);
        if (failed) {
            return Result.fail(failed.error!);
        }

        const values = results.map(r => r.getValue());
        return Result.ok(values);
    }

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

    public onSuccess(fn: (value: T) => void): Result<T> {
        if (this.isSuccess) {
            fn(this.getValue());
        }
        return this;
    }

    public onFailure(fn: (error: string) => void): Result<T> {
        if (this.isFailure) {
            fn(this.error!);
        }
        return this;
    }
}
