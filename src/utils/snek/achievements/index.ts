import Provider from "../index";
import * as queries from "./queries/data";

interface RunnerParameters {}

const runner = Provider.client.session;

const all = () => {
  const type = "fetch";

  try {
    return runner.customTask<{
      achievements: {
        title: string;
        description: string;
        points: number;
        image: { src: string };
        collectors: {
          firstName: string;
          lastName: string;
          personName: string;
        }[];
      }[];
    }>("query", queries.getAchievements, {});
  } catch {
    throw new Error(`Couldn't successfully ${type} achievements`);
  }
};

export { all };
