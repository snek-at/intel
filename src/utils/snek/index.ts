// main registration

// login -> handled via snek client
// logout -> handled via snek client

// get merged profile
// -> get cached calendar svg

// GitHub generation
// GitLab generation

// profile registration (GitHub, GitLab, (ops))
// profile deletion
// update profiles -> github, gitlab generation

// update settings

// soundcloud fetch

// instagram fetch

// imagur ?? own utils?

// update person page for settings/upload

//#region > Imports
//> All social related actions (like, follow,..)
import * as achievements from "./achievements";
import * as social from "./social";
import * as person from "./person";
import * as talks from "./person";
//> Clients
// Contains the clients for API calls to SNEK, Github and GitLab
import { SnekClient } from "snek-client";
//#endregion

//#region > Classes
class Provider {
  public static client = new SnekClient("https://engine.snek.at/graphql");
  public static achievements = achievements;
  // achievements.all()
  public static social = social;
  // social.follow()
  // social.unfollow()
  // social.like()
  // social.unlike()
  // social.getAchievements()
  public static person = person;
  // person.get() -> person page + merged profile
  // person.profiles() -> get all profiles for the person page
  // person.addGitHubProfile()
  // person.addGitLabProfile()
  // person.updateSettings()
  // person.addMetaLink()
  public static talks = talks;
  // person.addTalk()
  // person.deleteTalk()
  // person.getTalks()
  // person.getTalk()
}
//#endregion

//#region > Exports
export default Provider;
//#endregion
