
export class FuncStream<T> implements ReadableStream {
    locked: boolean = true; // Not implemented
    cancel(reason?: any): Promise<void> {
        throw new Error("Method not implemented.");
    }
    getReader(): ReadableStreamDefaultReader<any> {
        throw new Error("Method not implemented.");
    }
    pipeThrough<T>(transform: ReadableWritablePair<T, any>, options?: StreamPipeOptions | undefined): ReadableStream<T> {
        throw new Error("Method not implemented.");
    }
    pipeTo(destination: WritableStream<any>, options?: StreamPipeOptions | undefined): Promise<void> {
        throw new Error("Method not implemented.");
    }
    tee(): [ReadableStream<any>, ReadableStream<any>] {
        throw new Error("Method not implemented.");
    }

    
    map<U>(func: (v: T) => U, exec_context?: Worker): FuncStream<U> {
        throw new Error("Method not implemented.");
    }
    filter(func: (v: T) => boolean, exec_context?: Worker): FuncStream<T> {
        throw new Error("Method not implemented.");
    }
    reduce<U>(func: (prev: U, v: T) => U, initial: U, exec_context?: Worker): FuncStream<U> {
        throw new Error("Method not implemented.");
    }
    zip<U>(other: FuncStream<U>, exec_context?: Worker): FuncStream<T|U> {
        throw new Error("Method not implemented.");
    }
}

export class WritableFuncStream<T> extends FuncStream<T> implements WritableStream {
    abort(reason?: any): Promise<void> {
        throw new Error("Method not implemented.");
    }
    close(): Promise<void> {
        throw new Error("Method not implemented.");
    }
    getWriter(): WritableStreamDefaultWriter<any> {
        throw new Error("Method not implemented.");
    }

}
