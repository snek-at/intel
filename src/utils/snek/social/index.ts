import Provider from "../index";
import * as mutations from "./mutations/data";

interface RunnerParameters {
  /** A person page which starts the operation */
  invoker: string;
  /** A person page which which the operation aims to */
  receiver: string;
}

const runner = Provider.client.session.customTask;

const follow = (runnerOptions: RunnerParameters) => {
  const type = "follow";

  try {
    return runner<{
      followPerson: { totalFollowers: number };
    }>("mutation", mutations.follow, {});
  } catch {
    throw new Error(
      `Invoker: ${runnerOptions.invoker} couldn't successfully ${type} Receiver: ${runnerOptions.receiver}`
    );
  }
};

const unfollow = (runnerOptions: RunnerParameters) => {
  const type = "unfollow";

  try {
    return runner<{
      unfollowPerson: { totalFollowers: number };
    }>("mutation", mutations.unfollow, {});
  } catch {
    throw new Error(
      `Invoker: ${runnerOptions.invoker} couldn't successfully ${type} Receiver: ${runnerOptions.receiver}`
    );
  }
};

const like = (runnerOptions: RunnerParameters) => {
  const type = "like";

  try {
    return runner<{
      like: { totalFollowers: number };
    }>("mutation", mutations.unfollow, {});
  } catch {
    throw new Error(
      `Invoker: ${runnerOptions.invoker} couldn't successfully ${type} Receiver: ${runnerOptions.receiver}`
    );
  }
};

const unlike = (runnerOptions: RunnerParameters) => {
  const type = "unlike";

  try {
    return runner<{
      unlike: { totalFollowers: number };
    }>("mutation", mutations.unfollow, {});
  } catch {
    throw new Error(
      `Invoker: ${runnerOptions.invoker} couldn't successfully ${type} Receiver: ${runnerOptions.receiver}`
    );
  }
};

export { follow, unfollow, like, unlike };