if (typeof window === "undefined") {
  const { server } = require("./server");
  server.listen();
} else {
  const { worker } = require("./browser");
  worker.start();
}

export {}; // to avoid error Cannot be compiled under 'isolatedModules' because it is considered a global script file