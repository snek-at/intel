//#region > Imports
//#PACKAGE "snek-client"
// Contains a graphql client adopted for the SNEK backend
import { SnekClient } from "snek-client";

//> All social related actions (like, follow,..)
import * as achievement from "./achievement";
import * as general from "./general";
import * as social from "./social";
import * as person from "./person";
import * as talk from "./talk";
//#endregion

//#region > Classes
/**
 * @class Provider provides access to the snek backend
 */
class Provider {
  // Requires a valid instance of a snek engine running on localhost:8000.
  // The public snek server running on engine.snek.at can also be used.
  public static client = new SnekClient("http://localhost:8000/graphql");
  // API endpoints:
  //  achievement.all()
  //  achievement.redeem()
  public static achievement: typeof achievement = require("./achievement");
  // API endpoints:
  //  general.getGitlabServer()
  //  general.checkUserExists()
  public static general: typeof general = require("./general");
  // API endpoints:
  //  social.follow()
  //  social.unfollow()
  //  social.like()
  //  social.unlike()
  public static social: typeof social = require("./social");
  // API endpoints:
  //  person.allBrief()
  //  person.get()
  //  person.register()
  //  person.profiles()
  //  person.processProfiles()
  //  person.addProfile()
  //  person.deleteProfile()
  //  person.updateProfile()
  //  person.writeVariableStore()
  //  person.updateSettings()
  //  person.addMetaLink()
  //  person.deleteMetaLink()
  //  person.checkMetaLink()
  //  person.getInstagramPosts()
  public static person: typeof person = require("./person");
  // API endpoints:
  //  talk.getTalk()
  //  talk.getTalks()
  //  talk.addTalk()
  //  talk.deleteTalk()
  //  talk.addTalkComment()
  //  talk.deleteTalkComment()
  //  talk.updateTalkComment()
  public static talk: typeof talk = require("./talk");
}
//#endregion

//#region > Exports
export { Provider as default };
//#endregion
