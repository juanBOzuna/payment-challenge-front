import { Result } from './result';

describe('Result<T> - Railway Oriented Programming', () => {
    describe('ok', () => {
        it('should create a successful result with value', () => {
            const result = Result.ok(42);

            expect(result.isSuccess).toBe(true);
            expect(result.isFailure).toBe(false);
            expect(result.getValue()).toBe(42);
            expect(result.error).toBeUndefined();
        });

        it('should create a successful result without value', () => {
            const result = Result.ok();

            expect(result.isSuccess).toBe(true);
            expect(result.getValue()).toBeUndefined();
        });
    });

    describe('fail', () => {
        it('should create a failed result with error message', () => {
            const result = Result.fail<number>('Something went wrong');

            expect(result.isSuccess).toBe(false);
            expect(result.isFailure).toBe(true);
            expect(result.error).toBe('Something went wrong');
        });

        it('should throw when trying to get value from failed result', () => {
            const result = Result.fail<number>('Error');

            expect(() => result.getValue()).toThrow("Can't get the value of an error result");
        });
    });

    describe('map', () => {
        it('should transform successful result value', () => {
            const result = Result.ok(10);
            const mapped = result.map(x => x * 2);

            expect(mapped.isSuccess).toBe(true);
            expect(mapped.getValue()).toBe(20);
        });

        it('should propagate failure without calling map function', () => {
            const result = Result.fail<number>('Error');
            const mapped = result.map(x => x * 2);

            expect(mapped.isFailure).toBe(true);
            expect(mapped.error).toBe('Error');
        });

        it('should catch errors in map function', () => {
            const result = Result.ok(10);
            const mapped = result.map(() => {
                throw new Error('Map error');
            });

            expect(mapped.isFailure).toBe(true);
            expect(mapped.error).toBe('Map error');
        });
    });

    describe('bind (flatMap)', () => {
        it('should chain successful results', () => {
            const result = Result.ok(10);
            const bound = result.bind(x => Result.ok(x * 2));

            expect(bound.isSuccess).toBe(true);
            expect(bound.getValue()).toBe(20);
        });

        it('should propagate failure from first result', () => {
            const result = Result.fail<number>('First error');
            const bound = result.bind(x => Result.ok(x * 2));

            expect(bound.isFailure).toBe(true);
            expect(bound.error).toBe('First error');
        });

        it('should propagate failure from bind function', () => {
            const result = Result.ok(10);
            const bound = result.bind(() => Result.fail('Bind error'));

            expect(bound.isFailure).toBe(true);
            expect(bound.error).toBe('Bind error');
        });

        it('should catch errors in bind function', () => {
            const result = Result.ok(10);
            const bound = result.bind(() => {
                throw new Error('Bind exception');
            });

            expect(bound.isFailure).toBe(true);
            expect(bound.error).toBe('Bind exception');
        });
    });

    describe('combine', () => {
        it('should combine multiple successful results', () => {
            const results = [
                Result.ok(1),
                Result.ok(2),
                Result.ok(3)
            ];

            const combined = Result.combine(results);

            expect(combined.isSuccess).toBe(true);
            expect(combined.getValue()).toEqual([1, 2, 3]);
        });

        it('should fail if any result fails', () => {
            const results = [
                Result.ok(1),
                Result.fail<number>('Error in second'),
                Result.ok(3)
            ];

            const combined = Result.combine(results);

            expect(combined.isFailure).toBe(true);
            expect(combined.error).toBe('Error in second');
        });

        it('should return first failure when multiple fail', () => {
            const results = [
                Result.ok(1),
                Result.fail<number>('First error'),
                Result.fail<number>('Second error')
            ];

            const combined = Result.combine(results);

            expect(combined.isFailure).toBe(true);
            expect(combined.error).toBe('First error');
        });
    });

    describe('onSuccess', () => {
        it('should execute callback on successful result', () => {
            const callback = vi.fn();
            const result = Result.ok(42);

            result.onSuccess(callback);

            expect(callback).toHaveBeenCalledWith(42);
        });

        it('should not execute callback on failed result', () => {
            const callback = vi.fn();
            const result = Result.fail<number>('Error');

            result.onSuccess(callback);

            expect(callback).not.toHaveBeenCalled();
        });

        it('should return the same result for chaining', () => {
            const result = Result.ok(42);
            const returned = result.onSuccess(() => { });

            expect(returned).toBe(result);
        });
    });

    describe('onFailure', () => {
        it('should execute callback on failed result', () => {
            const callback = vi.fn();
            const result = Result.fail<number>('Error message');

            result.onFailure(callback);

            expect(callback).toHaveBeenCalledWith('Error message');
        });

        it('should not execute callback on successful result', () => {
            const callback = vi.fn();
            const result = Result.ok(42);

            result.onFailure(callback);

            expect(callback).not.toHaveBeenCalled();
        });

        it('should return the same result for chaining', () => {
            const result = Result.fail<number>('Error');
            const returned = result.onFailure(() => { });

            expect(returned).toBe(result);
        });
    });

    describe('Railway pattern - real-world scenario', () => {
        it('should chain multiple operations successfully', () => {
            const result = Result.ok(10)
                .map(x => x * 2)
                .bind(x => Result.ok(x + 5))
                .map(x => x.toString());

            expect(result.isSuccess).toBe(true);
            expect(result.getValue()).toBe("25");
        });

        it('should stop at first failure in chain', () => {
            const result = Result.ok(10)
                .map(x => x * 2)
                .bind(() => Result.fail('Error'))
                .map(x => x + 100);

            expect(result.isFailure).toBe(true);
            expect(result.error).toBe('Error');
        });

        it('should handle side effects in railway', () => {
            const sideEffects: string[] = [];

            Result.ok(10)
                .onSuccess(x => sideEffects.push(`Success: ${x}`))
                .map(x => x * 2)
                .onSuccess(x => sideEffects.push(`Doubled: ${x}`))
                .bind(() => Result.fail('Error'))
                .onFailure(err => sideEffects.push(`Failed: ${err}`));

            expect(sideEffects).toEqual([
                'Success: 10',
                'Doubled: 20',
                'Failed: Error'
            ]);
        });
    });

    describe('constructor validation', () => {
        it('should throw if success result has error', () => {
            expect(() => {
                new Result(true, 'error', 42);
            }).toThrow('A result cannot be successful and contain an error');
        });

        it('should throw if failure result has no error', () => {
            expect(() => {
                new Result(false, undefined, undefined);
            }).toThrow('A failing result needs to contain an error message');
        });
    });
});
