import process from "process";

const dynamic = async () => {
  const plugin = process.argv[2];

  try {
    const { run } = await import(`./plugins/${plugin}.js`);
    console.log(run());
  } catch {
    console.log("Plugin not found");
    process.exit(1);
  }
};

await dynamic();
