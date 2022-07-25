import { FuncStream, WritableFuncStream } from '../src/virta'


describe("test FuncStream's ReadableStream interface", () => {
  let stream: FuncStream<number>;
  beforeEach(() => {
    stream = new FuncStream<number>();
  });

  describe("test cancel()", () => {
    test('stream.cancel() should return TypeError if stream is locked', async () => {
      stream.locked = false;
      await expect(stream.cancel()).rejects.toBeInstanceOf(TypeError);
    });
    test("stream should shut down properly", async () => {
      await expect(stream.cancel()).resolves.not.toThrow();
    });
  });

  describe("test getReader()", () => {
    test('should not throw initially', async () => {
      await expect(stream.cancel()).resolves.not.toThrow();
    });
    test('should lock the stream', async () => {
      stream.getReader();
      expect(stream.locked).toBe(true);
      await expect(stream.getReader()).rejects.toBeInstanceOf(TypeError);
    });
    test('should return a ReadableStreamDefaultReader', async () => {
      await expect(stream.getReader()).resolves.toBeInstanceOf(ReadableStreamDefaultReader);
    });

    // TODO:
    // ADD "byob"
  });

  describe("test pipeThrough()", () => {
    let transformer: TransformStream;
    beforeEach(() => {
      transformer = new TransformStream();
    });

    test('should lock the stream', () => {
      stream.pipeThrough(transformer);
      expect(stream.locked).toBe(true);
    });
    test('should return a readable stream', () => {
      expect(stream.pipeThrough(transformer)).toBeInstanceOf(ReadableStream);
    });
  });

  describe("test pipeTo()", () => {
    let writable: WritableStream;
    beforeEach(() => {
      writable = new WritableStream();
    });

    test("should lock the stream", () => {
      stream.pipeTo(writable);
      expect(stream.locked).toBe(true);
    });
  });

  describe("test tee()", () => {
    test("should return an array containing two readable streams", () => {
      const arr = stream.tee();

      expect(arr).toBeInstanceOf(Array);
      expect(arr.length).toBe(2);
      expect(arr[0]).toBeInstanceOf(ReadableStream);
      expect(arr[1]).toBeInstanceOf(ReadableStream);
    });
    /* test("the teed streams should receive the same values", () => {
      const [s1, s2] = stream.tee();

      expect(s1.getReader().read().then(v => v.value)).resolves.toBe("test string");
      expect(s2.getReader().read().then(v => v.value)).resolves.toBe("test string");
    }) */
  });

});

describe("test WritableFuncStream's WritableStream implementation", () => {
  // TODO
})

describe("test FuncStream functions", () => {
  let stream: WritableFuncStream<number>;
  beforeEach(() => {
    stream = new WritableFuncStream<number>();
  });

  describe("test map()", () => {
    test("should return a FuncStream", () => {
      expect(stream.map(v => v)).toBeInstanceOf(FuncStream);
    });
    test("the mapping function should be applied", async () => {
      const readable = stream.map(v => v*2);
      await stream.getWriter().write(2);
      await expect(readable.getReader().read().then(v => v.value)).resolves.toBe(4);
    });
  });

  describe("test filter()", () => {
    test("should return a FuncStream", () => {
      expect(stream.filter(v => v !== 1)).toBeInstanceOf(FuncStream);
    });
    test("the filter function should be applied", async () => {
      const readable = stream.map(v => v !== 1);
      const writer = stream.getWriter()
      await writer.write(1);
      await writer.write(2);
      await expect(readable.getReader().read().then(v => v.value)).resolves.toBe(2);
    });
  });

  describe("test reduce()", () => {
    test("should return a FuncStream", () => {
      expect(stream.reduce((prev: number, current) => prev+current, 0)).toBeInstanceOf(FuncStream);
    });
    test("the filter function should be applied", async () => {
      const readable = stream.reduce((prev: number, current) => prev+current, 0);
      const writer = stream.getWriter();
      await writer.write(1);
      await expect(readable.getReader().read().then(v => v.value)).resolves.toBe(1);
      await writer.write(1);
      await expect(readable.getReader().read().then(v => v.value)).resolves.toBe(2);
    });
  });

  describe("test zip()", () => {
    let src1: WritableFuncStream<string>, src2: WritableFuncStream<string>
    beforeEach(() => {
      src1 = new WritableFuncStream<string>();
      src2 = new WritableFuncStream<string>();
    })
    test("should return a FuncStream", () => {
      expect(src1.zip(src2)).toBeInstanceOf(FuncStream);
    });
    test("inputs to each src stream should be piped into resulting stream", async () => {
      const readable = src1.zip(src2);
      await src1.getWriter().write("test from scr1");
      await expect(readable.getReader().read().then(v => v.value)).resolves.toBe("test from src1");
      await src2.getWriter().write("test from src2");
      await expect(readable.getReader().read().then(v => v.value)).resolves.toBe("test from src2");
    });
  });
})