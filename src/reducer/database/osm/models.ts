//#region > Imports
//#PACKAGE "moment"
//## npm install "moment"@2.25.3
// A lightweight JavaScript date library for parsing,
// validating, manipulating, and formatting dates.
import moment from "moment";

//> Re-constructor
// SOAssembler for statement objects
import { SOAssembler } from "./reconstructor";
//> Statements
// Contains SQL statements
import * as platform from "./statements/platform";
import * as member from "./statements/member";
import * as repository from "./statements/repository";
import * as repositoryHasMember from "./statements/repositoryHasMember";
import * as platformHasRepository from "./statements/platformHasRepository";
import * as language from "./statements/language";
import * as organization from "./statements/organization";
import * as organizationHasMember from "./statements/organizationHasMember";
import * as platformHasOrganization from "./statements/platformHasOrganization";
import * as statistic from "./statements/statistic";
import * as streak from "./statements/streak";
import * as calendar from "./statements/calendar";
import * as contribution from "./statements/contribution";
import * as talk from "./statements/talk";
//> Helper
// Contains all helper
import * as helper from "../helper";
//#endregion

//#region > Interfaces
/** @interface Share defines the structure of a contribution type share */
interface Share {
  /**
   * Size: The size of the share. E.g: 51.92%.
   */
  size: number;
  /**
   * Total: The amount of contributions within a share.
   */
  total: number;
}
//#endregion

/**
 * Implementation examples of the statement objects defined below.
 *
 * @see {@link https://bit.ly/3eu58YP |SNEK Models} for implementation
 *      examples.
 */

//#region > Classes
/**
 * @abstract
 * @class A basic statement object class which provides access
 *        to the SOAssembler and squeezer.
 */
abstract class BaseSO {
  //> Static Fields
  /**
   * Provides access to the SOAssembler to provide functionality like create,
   * all, filter,...
   *
   * @static
   * @tutorial Usage: "public static objects =
   *                   StatementObject.getObjects(osmModel);"
   */
  static objects: SOAssembler;

  //> Abstract Fields
  /**
   * Necessary for database processing.
   */
  abstract id: number;

  //> Abstract Methods
  /**
   * Writes the statement object to the database.
   *
   * @returns {Boolean} A check if the database write process was successful
   */
  abstract save(): void;

  /**
   * Necessary for interacting with the SOAssambler on object level.
   */
  abstract objects: SOAssembler;

  /**
   * Defines the osm table name.
   */
  abstract tableName(): string;

  //> Static Methods
  /**
   * Generate a new SOAssembler object, with the provided osm model.
   *
   * @static
   * @param self A implementation of a statement object
   * @returns {SOAssembler} A SOAssembler object
   */
  static getObjects(self: any) {
    return new SOAssembler(self);
  }

  //> Methods
  /**
   * Filter the statement objects with a list of keys.
   *
   * @param filter List of keys to filter by
   * @returns {any} The filtered object
   */
  render(filter: string[], excludes: string[] = ["objects"]): any {
    return helper.general.squeezer(this, filter, excludes);
  }
}

/**
 * @abstract
 * @class A statement object which implements the platform sql statements
 */
abstract class PlatformSO extends BaseSO {
  //> Static Fields
  static statements = platform;

  //> Static Methods
  /**
   * Get the platform with the lowest createdAt.
   *
   * @static
   * @returns {object} A object containing platform data with the lowest
   *                   creation date.
   */
  static getLowestCreatedAtYear() {
    return SOAssembler.database.exec(
      PlatformSO.statements.lowestCreatedAtYear
    )[0];
  }

  /**
   * Get a list of source types and its total.
   *
   * @static
   * @returns {object[]} A object list containing source types
   */
  static getSourceTypes() {
    return SOAssembler.database.exec(PlatformSO.statements.getSourceTypes);
  }

  //> Abstract Methods
  /**
   * Used to create a repository within the platform.
   *
   * @param fields Repository data
   * @returns {RepositorySO} A repository statement object
   */
  abstract createRepository(fields: any): RepositorySO;

  /**
   * Used to create a organization within the platform.
   *
   * @param fields Organization data
   * @returns {OrganizationSO} A organization statement object
   */
  abstract createOrganization(fields: any): OrganizationSO;

  /**
   * Used to create a statistic within the platform.
   *
   * @param fields Statistic data
   * @returns {StatisticSO} A statistic statement object
   */
  abstract createStatistic(fields: any): StatisticSO;

  /**
   * Used to create a calendar day within the platform.
   *
   * @param fields Calendar entry data
   * @returns {CalendarSO} A calendar statement object
   */
  abstract createCalendarEntry(fields: any): CalendarSO;

  /**
   * Used to get all repositories within the platform.
   *
   * @returns {RepositorySO[]} A list of repository statement objects
   */
  abstract getRepositories(fields: any): RepositorySO[];

  /**
   * Used to get all organizations within the platform.
   *
   * @returns {OrganizationSO[]} A list of organization statement objects
   */
  abstract getOrganizations(fields: any): OrganizationSO[];

  /**
   * Used to get contribution calendar of the platform.
   *
   * @returns {Object} A calendar structure in any format
   */
  abstract getCalendar(dates: any): object;

  //> Methods
  /**
   * Returns the database table name of this osm model.
   *
   * @static
   * @returns {string} A table name
   */
  tableName() {
    return "platform";
  }

  //> Model Implementation Example
  // class PlatformModel extends PlatformSO{
  //   /**
  //    * General usage: objects.create({fields}), objects.filter({id=1}),
  //    *                objects.all()
  //    *
  //    * @see {@link https://bit.ly/2KgKi0R |SNEK Reconstructor}
  //    *      for further information.
  //    */
  //   public static objects = PlatformSO.getObjects(PlatformModel);

  //   /**
  //    * Fields may contain all fields defined by the database table.
  //    * Notice!: The NOT NULL fields are strictly required!
  //    * Also custom fields are possible too.
  //    * Notice!: Custom field cannot be saved in the database without
  //    *          modifying the initialize statement of the statement
  //    *          object!
  //    *
  //    * @see {@link https://bit.ly/3eqFFPO |Platform SQL statements}
  //    *      for further information.
  //    */
  //   constructor(fields: PlatformFields){
  //     super();
  //
  //     this.id = fields.id;
  //   }

  //   /**
  //    * Example method:
  //    *
  //    * @description A method to save the object to the database.
  //    * Only fields defined in the constructor will be saved!
  //    * IMPORTANT!: The fields in objects.create() have to match the SQL
  //    *             insert statement! Therefore unused fields have to be set
  //    *             to null!
  //    *
  //    */
  //   save(){
  //     PlatformModel.objects.create({id: this.id});
  //   }

  //   /**
  //    * Example method:
  //    *
  //    * @description A method to filter the database for id=0.
  //    */
  //   getFirstItem(){
  //     return PlatformModel.objects.filter({id: 0}) as PlatformModel;
  //   }

  //   /**
  //    * Example method:
  //    *
  //    * @description A method to get all entries and parse it to a list of
  //    *              models.
  //    */
  //   getAll(){
  //     return PlatformModel.objects.all() as PlatformModel[];
  //   }
  // }
}

/**
 * @abstract
 * @class A statement object which implements the member sql statements.
 */
abstract class MemberSO extends BaseSO {
  //> Static Fields
  static statements = member;

  //> Methods
  /**
   * Get the database table name of this osm model.
   *
   * @static
   * @returns {string} A table name
   */
  tableName() {
    return "member";
  }

  //> Model Implementation Example
  //  class MemberModel extends MemberSO{
  //  /**
  //    * General usage: objects.create({fields}), objects.filter({id=1}),
  //    *                objects.all()
  //    *
  //    * @see {@link https://bit.ly/2z7epWs |SNEK Reconstructor}
  //    *      for further information.
  //    */
  //  public static objects = PlatformSO.getObjects(MemberModel);

  //  /**
  //    * Fields may contain all fields defined by the database table.
  //    * Notice!: The NOT NULL fields are strictly required!
  //    * Also custom fields are possible too.
  //    * Notice!: Custom field cannot be saved in the database without
  //    *          modifying the initialize statement of the statement
  //    *          object!
  //    *
  //    * @see {@link https://bit.ly/2VfhPiD |Member SQL statements} for further
  //    *      information.
  //    */
  //    constructor(fields: MemberFields){
  //      super();
  //
  //      this.id = fields.id;
  //    }

  //    /**
  //      * Example method:
  //      *
  //      * @description A method to save the object to the database.
  //      * Only fields defined in the constructor will be saved!
  //      * IMPORTANT!: The fields in objects.create() have to match the SQL
  //      *             insert statement! Therefore unused fields have to be set
  //      *             to null!
  //      *
  //      */
  //    save(){
  //      MemberModel.objects.create({id: this.id});
  //    }

  //    /**
  //      * Example method:
  //      *
  //      * @description A method to filter the database for id=0.
  //      */
  //    getFirstItem(){
  //      return MemberModel.objects.filter({id: 0}) as MemberModel;
  //    }

  //    /**
  //      * Example method:
  //      *
  //      * @description A method to get all entries and parse it to a list of
  //      *              models.
  //      */
  //    getAll(){
  //      return MemberModel.objects.all() as MemberModel[];
  //    }
  //  }
}

/**
 * @abstract
 * @class A statement object which implements the repository sql statements
 */
abstract class RepositorySO extends BaseSO {
  //> Static Fields
  static statements = repository;

  //> Static Methods
  /**
   * Get a list of merged language data.
   *
   * @static
   * @returns {Object[]} List of language data objects
   */
  static getLanguages() {
    return SOAssembler.database.exec(LanguageSO.statements.merged);
  }

  //> Abstract Methods
  /**
   * Used to create a member within the repository.
   *
   * @param fields Statistic data
   * @returns {MemberSO} A member statement object
   */
  abstract createMember(fields: any): MemberSO;

  /**
   * Used to create a language within the repository.
   *
   * @param fields Language data
   * @returns {MemberSO} A language statement object
   */
  abstract createLanguage(fields: any): LanguageSO;

  /**
   * Used to get all members within the repository.
   *
   * @returns {MemberSO[]} A list of member statement objects
   */
  abstract getMembers(fields: any): MemberSO[];

  /**
   * Used to get all languages within the repository.
   *
   * @returns {LanguageSO[]} A list of language statement objects
   */
  abstract getLanguages(fields: any): LanguageSO[];

  //> Methods
  /**
   * Get the database table name of this osm model.
   *
   * @static
   * @returns {string} A table name
   */
  tableName() {
    return "repository";
  }

  //> Model Implementation Example
  // class RepositoryModel extends RepositorySO{
  //   /**
  //    * General usage: objects.create({fields}), objects.filter({id=1}),
  //    *                objects.all()
  //    *
  //    * @see {@link https://bit.ly/34GtpX3 |SNEK Reconstructor} for further
  //    *      information.
  //    */
  //   public static objects = PlatformSO.getObjects(RepositoryModel);

  //   /**
  //    * Fields may contain all fields defined by the database table.
  //    * Notice!: The NOT NULL fields are strictly required!
  //    * Also custom fields are possible too.
  //    * Notice!: Custom field cannot be saved in the database without
  //    *          modifying the initialize statement of the statement
  //    *          object!
  //    *
  //    * @see {@link https://bit.ly/2wOO5Qa |Repository SQL statements} for
  //    *      further information.
  //    */
  //   constructor(fields: RepositoryFields){
  //     super();
  //
  //     this.id = fields.id;
  //   }

  //   /**
  //    * Example method:
  //    *
  //    * @description A method to save the object to the database.
  //    * Only fields defined in the constructor will be saved!
  //    * IMPORTANT!: The fields in objects.create() have to match the SQL
  //    *             insert statement! Therefore unused fields have to be set
  //    *             to null!
  //    */
  //   save(){
  //     RepositoryModel.objects.create({id: this.id});
  //   }

  //   /**
  //    * Example method:
  //    *
  //    * @description A method to filter the database for id=0.
  //    */
  //   getFirstItem(){
  //     return RepositoryModel.objects.filter({id: 0}) as RepositoryModel;
  //   }

  //   /**
  //    * Example method:
  //    *
  //    * @description A method to get all entries and parse it to a list of
  //    *              models.
  //    */
  //   getAll(){
  //     return RepositoryModel.objects.all() as RepositoryModel[];
  //   }
  // }
}

/**
 * @abstract
 * @class A statement object which implements the platformHasMember sql
 *        statements.
 */
abstract class RepositoryHasMemberSO extends BaseSO {
  //> Static Fields
  static statements = repositoryHasMember;

  //> Methods
  /**
   * Get the database table name of this osm model.
   *
   * @static
   * @returns {string} A table name
   */
  tableName() {
    return "repositoryhasmember";
  }

  //> Model Implementation Example
  // class RepositoryHasMemberModel extends RepositoryHasMemberSO{
  //   /**
  //    * General usage: objects.create({fields}), objects.filter({id=1}),
  //    *                objects.all()
  //    *
  //    * @see {@link https://bit.ly/2Vxq1tu |SNEK Reconstructor} for further
  //    *      information.
  //    */
  //   public static objects = PlatformSO.getObjects(RepositoryHasMemberModel);

  //   /**
  //    * Fields may contain all fields defined by the database table.
  //    * Notice!: The NOT NULL fields are strictly required!
  //    * Also custom fields are possible too.
  //    * Notice!: Custom field cannot be saved in the database without
  //    *          modifying the initialize statement of the statement
  //    *          object!
  //    *
  //    * @see {@link https://bit.ly/34LLjHN |RepositoryHasMember SQL statements}
  //    *      for further information.
  //    */
  //   constructor(fields: RepositoryHasMemberFields){
  //     super();
  //
  //     this.id = fields.id;
  //   }

  //   /**
  //    * Example method:
  //    *
  //    * @description A method to save the object to the database.
  //    * Only fields defined in the constructor will be saved!
  //    * IMPORTANT!: The fields in objects.create() have to match the SQL
  //    *             insert statement! Therefore unused fields have to be set
  //    *             to null!
  //    */
  //   save(){
  //     RepositoryHasMemberModel.objects.create({id: this.id});
  //   }

  //   /**
  //    * Example method:
  //    *
  //    * @description A method to filter the database for id=0.
  //    */
  //   getFirstItem(){
  //     return RepositoryHasMemberModel.objects.filter({id: 0})
  //              as RepositoryHasMemberModel;
  //   }

  //   /**
  //    * Example method:
  //    *
  //    * @description A method to get all entries and parse it to a list of
  //    *              models.
  //    */
  //   getAll(){
  //     return RepositoryHasMemberModel.objects.all()
  //              as RepositoryHasMemberModel[];
  //   }
  // }
}

/**
 * @abstract
 * @class A statement object which implements the language sql statements
 */
abstract class LanguageSO extends BaseSO {
  //> Static Fields
  static statements = language;

  //> Methods
  /**
   * Get the database table name of this osm model.
   *
   * @static
   * @returns {string} A table name
   */
  tableName() {
    return "language";
  }

  //> Model Implementation Example
  // class LanguageModel extends LanguageSO{
  //   /**
  //    * General usage: objects.create({fields}), objects.filter({id=1}),
  //    *                objects.all()
  //    *
  //    * @see {@link https://bit.ly/2Vxq1tu |SNEK Reconstructor} for further
  //    *      information.
  //    */
  //   public static objects = PlatformSO.getObjects(LanguageModel);

  //   /**
  //    * Fields may contain all fields defined by the database
  //    * table.
  //    * Notice!: The NOT NULL fields are strictly required!
  //    * Also custom fields are possible too.
  //    * Notice!: Custom field cannot be saved in the database without
  //               modifying the initialize statement of the statement
  //               object!
  //    *
  //    * @see {@link https://bit.ly/2K7zAd8 |Language SQL statements}
  //    *      for further information.
  //    */
  //   constructor(fields: LanguageFields){
  //     super();
  //
  //     this.id = fields.id;
  //   }

  //   /**
  //    * Example method:
  //    *
  //    * @description A method to save the object to the database.
  //    * Only fields defined in the constructor will be saved!
  //    * IMPORTANT!: The fields in objects.create() have to match the SQL
  //    *             insert statement! Therefore unused fields have to be set
  //    *             to null!
  //    */
  //   save(){
  //     LanguageModel.objects.create({id: this.id});
  //   }

  //   /**
  //    * Example method:
  //    *
  //    * @description A method to filter the database for id=0.
  //    */
  //   getFirstItem(){
  //     return LanguageModel.objects.filter({id: 0}) as LanguageModel;
  //   }

  //   /**
  //    * Example method:
  //    *
  //    * @description A method to get all entries and parse it to a list of
  //    models.
  //    */
  //   getAll(){
  //     return LanguageModel.objects.all() as LanguageModel[];
  //   }
  // }
}

/**
 * @abstract
 * @class A statement object which implements the platformHasRepository
 *        sql statements.
 */
abstract class PlatformHasRepositorySO extends BaseSO {
  //> Static Fields
  static statements = platformHasRepository;

  //> Methods
  /**
   * Get the database table name of this osm model.
   *
   * @static
   * @returns {string} A table name
   */
  tableName() {
    return "platformhasrepository";
  }

  //> Model Implementation Example
  // class PlatformHasRepositoryModel extends PlatformHasRepositorySO{
  //   /**
  //    * General usage: objects.create({fields}), objects.filter({id=1}),
  //    *                objects.all()
  //    *
  //    * @see {@link https://bit.ly/2Vxq1tu |SNEK Reconstructor} for further
  //    *      information.
  //    */
  //   public static objects =
  //                          PlatformSO.getObjects(PlatformHasRepositoryModel);

  //   /**
  //    * Fields may contain all fields defined by the database table.
  //    * Notice!: The NOT NULL fields are strictly required!
  //    * Also custom fields are possible too.
  //    * Notice!: Custom field cannot be saved in the database without
  //    *          modifying the initialize statement of the statement
  //    *          object!
  //    *
  //    * @see {@link https://bit.ly/3cAuD99 |PlatformHasRepository SQL
  //    *                                     statements} for further
  //    *                                     information.
  //    *
  //    */
  //   constructor(fields: PlatformHasRepositoryFields){
  //     super();
  //
  //     this.id = fields.id;
  //   }

  //   /**
  //    * Example method:
  //    *
  //    * @description A method to save the object to the database.
  //    * Only fields defined in the constructor will be saved!
  //    * IMPORTANT!: The fields in objects.create() have to match the SQL
  //    *             insert statement! Therefore unused fields have to be set
  //    *             to null!
  //    */
  //   save(){
  //     PlatformHasRepositoryModel.objects.create({id: this.id});
  //   }

  //   /**
  //    * Example method:
  //    *
  //    * @description A method to filter the database for id=0.
  //    */
  //   getFirstItem(){
  //     return PlatformHasRepositoryModel.objects.filter({id: 0})
  //              as PlatformHasRepositoryModel;
  //   }

  //   /**
  //    * Example method:
  //    *
  //    * @description A method to get all entries and parse it to a list
  //    *              of models.
  //    */
  //   getAll(){
  //     return PlatformHasRepositoryModel.objects.all()
  //              as PlatformHasRepositoryModel[];
  //   }
  // }
}

/**
 * @abstract
 * @class A statement object which implements the organization sql statements
 */
abstract class OrganizationSO extends BaseSO {
  //> Static Fields
  static statements = organization;

  //> Abstract Methods
  /**
   * Create a member within this organization.
   *
   * @abstract
   * @param fields Member data
   * @returns {MemberSO} A member statement object
   */
  abstract createMember(fields: any): MemberSO;

  /**
   * Get all members within this organization.
   *
   * @abstract
   * @returns {MemberSO[]} A list of member statement objects
   */
  abstract getMembers(): MemberSO[];

  /**
   * Get all repositories within this organization.
   *
   * @abstract
   * @returns {RepositorySO[]} A list of repository statement objects
   */
  abstract getRepositories(): RepositorySO[];

  //> Methods
  /**
   * Get the database table name of this osm model.
   *
   * @static
   * @returns {string} A table name
   */
  tableName() {
    return "organization";
  }

  //> Model Implementation Example
  // class OrganizationModel extends OrganizationSO{
  //   /**
  //    * General usage: objects.create({fields}), objects.filter({id=1}),
  //    *                objects.all()
  //    *
  //    * @see {@link https://bit.ly/2Vxq1tu |SNEK Reconstructor} for further
  //    *      information.
  //    */
  //   public static objects = PlatformSO.getObjects(OrganizationModel);

  //   /**
  //    * Fields may contain all fields defined by the database table.
  //    * Notice!: The NOT NULL fields are strictly required!
  //    * Also custom fields are possible too.
  //    * Notice!: Custom field cannot be saved in the database without
  //    *          modifying the initialize statement of the statement
  //    *          object!
  //    *
  //    * @see {@link https://bit.ly/2Ka0fGh |Organization SQL statements}
  //    *      for further information.
  //    */
  //   constructor(fields: OrganizationFields){
  //     super();
  //
  //     this.id = fields.id;
  //   }

  //   /**
  //    * Example method:
  //    *
  //    * @description A method to save the object to the database.
  //    * Only fields defined in the constructor will be saved!
  //    * IMPORTANT!: The fields in objects.create() have to match the SQL
  //    *             insert statement! Therefore unused fields have to be set
  //    *             to null!
  //    */
  //   save(){
  //     OrganizationModel.objects.create({id: this.id});
  //   }

  //   /**
  //    * Example method:
  //    *
  //    * @description A method to filter the database for id=0.
  //    */
  //   getFirstItem(){
  //     return OrganizationModel.objects.filter({id: 0}) as OrganizationModel;
  //   }

  //   /**
  //    * Example method:
  //    *
  //    * @description A method to get all entries and parse it to a list of
  //    *              models.
  //    */
  //   getAll(){
  //     return OrganizationModel.objects.all() as OrganizationModel[];
  //   }
  // }
}

/**
 * @abstract
 * @class A statement object which implements the organizationHasMember sql
 *        statements.
 */
abstract class OrganizationHasMemberSO extends BaseSO {
  //> Static Fields
  static statements = organizationHasMember;

  //> Methods
  /**
   * Get the database table name of this osm model.
   *
   * @static
   * @returns {string} A table name
   */
  tableName() {
    return "organizationhasmember";
  }

  //> Model Implementation Example
  // class OrganizationHasMemberModel extends OrganizationHasMemberSO{
  //   /**
  //    * General usage: objects.create({fields}), objects.filter({id=1}),
  //    *                objects.all()
  //    *
  //    * @see {@link https://bit.ly/2Vxq1tu |SNEK Reconstructor}
  //    *      for further information.
  //    */
  //   public static objects =
  //                          PlatformSO.getObjects(OrganizationHasMemberModel);

  //   /**
  //    * Fields may contain all fields defined by the database table.
  //    * Notice!: The NOT NULL fields are strictly required!
  //    * Also custom fields are possible too.
  //    * Notice!: Custom field cannot be saved in the database without
  //    *          modifying the initialize statement of the statement
  //    *          object!
  //    *
  //    * @see {@link https://bit.ly/34OKcY4 |OrganizationHasMember SQL
  //    *                                     statements} for further
  //    *                                     information.
  //    */
  //   constructor(fields: OrganizationHasMemberFields){
  //     super();
  //
  //     this.id = fields.id;
  //   }

  //   /**
  //    * Example method:
  //    *
  //    * @description A method to save the object to the database.
  //    * Only fields defined in the constructor will be saved!
  //    * IMPORTANT!: The fields in objects.create() have to match the SQL
  //    *             insert statement! Therefore unused fields have to be set
  //    *             to null!
  //    */
  //   save(){
  //     OrganizationHasMemberModel.objects.create({id: this.id});
  //   }

  //   /**
  //    * Example method:
  //    *
  //    * @description A method to filter the database for id=0.
  //    */
  //   getFirstItem(){
  //     return OrganizationHasMemberModel.objects.filter({id: 0})
  //              as OrganizationHasMemberModel;
  //   }

  //   /**
  //    * Example method:
  //    *
  //    * @description A method to get all entries and parse it to a list of
  //    *              models.
  //    */
  //   getAll(){
  //     return OrganizationHasMemberModel.objects.all()
  //              as OrganizationHasMemberModel[];
  //   }
  // }
}

/**
 * @abstract
 * @class A statement object which implements the platformHasOrganization sql
 *        statements.
 */
abstract class PlatformHasOrganizationSO extends BaseSO {
  //> Static Fields
  static statements = platformHasOrganization;

  //> Methods
  /**
   * Get the database table name of this osm model.
   *
   * @static
   * @returns {string} A table name
   */
  tableName() {
    return "platformhasorganization";
  }

  //> Model Implementation Example
  // class PlatformHasOrganizationModel extends PlatformHasOrganizationSO{
  //   /**
  //    * General usage: objects.create({fields}), objects.filter({id=1}),
  //    *                objects.all()
  //    *
  //    * @see {@link https://bit.ly/2Vxq1tu |SNEK Reconstructor}
  //    *      for further information.
  //    */
  //   public static objects =
  //                       PlatformSO.getObjects(PlatformHasOrganizationModel);

  //   /**
  //    * Fields may contain all fields defined by the database table.
  //    * Notice!: The NOT NULL fields are strictly required!
  //    * Also custom fields are possible too.
  //    * Notice!: Custom field cannot be saved in the database without
  //    *          modifying the initialize statement of the statement
  //    *          object!
  //    *
  //    * @see {@link https://bit.ly/2VDx5Ve |PlatformHasOrganization SQL
  //    *                                     statements} for further
  //    *                                     information.
  //    */
  //   constructor(fields: StatisticFields){
  //     super();
  //
  //     this.id = fields.id;
  //   }

  //   /**
  //    * Example method:
  //    *
  //    * @description A method to save the object to the database.
  //    * Only fields defined in the constructor will be saved!
  //    * IMPORTANT!: The fields in objects.create() have to match the SQL
  //    *             insert statement! Therefore unused fields have to be set
  //    *             to null!
  //    */
  //   save(){
  //     PlatformHasOrganizationModel.objects.create({id: this.id});
  //   }

  //   /**
  //    * Example method:
  //    *
  //    * @description A method to filter the database for id=0.
  //    */
  //   getFirstItem(){
  //     return PlatformHasOrganizationModel.objects.filter({id: 0})
  //              as PlatformHasOrganizationModel;
  //   }

  //   /**
  //    * Example method:
  //    *
  //    * @description A method to get all entries and parse it to a list of
  //    *              models.
  //    */
  //   getAll(){
  //     return PlatformHasOrganizationModel.objects.all()
  //              as PlatformHasOrganizationModel[];
  //   }
  // }
}

/**
 * @abstract
 * @class A statement object which implements the statistic sql statements
 */
abstract class StatisticSO extends BaseSO {
  //> Static Fields
  static statements = statistic;

  //> Static Methods
  /**
   * Get a merged statistic over all platforms.
   *
   * @static
   * @param cls A extended class of StatisticSO
   * @returns {Object[]} A list of objects containing statistic data
   */
  static getMerged(cls: any) {
    let response = SOAssembler.database.exec(StatisticSO.statements.allMerged);

    // Parse to class objects
    response = response.map((entry: any) => {
      return new cls(entry);
    });

    return response;
  }

  /**
   * Get a merged contributions over all platforms.
   *
   * @static
   * @param self A object of the extended class of StatisticSO
   * @returns {object[]} A list of objects containing contribution data
   */
  static getContributions(self: any) {
    let response = null;

    if (!self.id) {
      response = {
        commit: SOAssembler.database.exec(
          StatisticSO.statements.commitContributionsOfYear,
          [self.year]
        )[0] as Share,
        issue: SOAssembler.database.exec(
          StatisticSO.statements.issueContributionsOfYear,
          [self.year]
        )[0] as Share,
        pullRequest: SOAssembler.database.exec(
          StatisticSO.statements.pullRequestContributionsOfYear,
          [self.year]
        )[0] as Share,
        pullRequestReview: SOAssembler.database.exec(
          StatisticSO.statements.pullRequestReviewContributionsOfYear,
          [self.year]
        )[0] as Share,
        total: 0,
      };

      // Calculate the total contribution by summing up all types
      response.total =
        response.commit.total +
        response.issue.total +
        response.pullRequest.total +
        response.pullRequestReview.total;
    }

    if (response) {
      return response;
    }

    const defaultShare: Share = {
      total: 0,
      size: 0,
    };

    return {
      commit: defaultShare,
      issue: defaultShare,
      pullRequest: defaultShare,
      pullRequestReview: defaultShare,
      total: 0,
    };
  }

  //> Abstract Methods
  /**
   * Used to create a streak within the statistic.
   *
   * @param fields Streak data
   * @returns {MemberSO} A streak statement object
   */
  abstract createStreak(fields: any): StreakSO;

  /**
   * Used to get all streaks within the statistic.
   *
   * @returns {StreakSO[]} A streak statement object
   */
  abstract getStreaks(): StreakSO[];

  /**
   * Used to calculate all the longest and current streak.
   *
   * @returns {StreakSO[]} The longest and current streak statement objects
   */
  abstract getStreakDetail(
    streaks: StreakSO[]
  ): { longest: StreakSO; current: StreakSO };

  /**
   * Used to calculate the busiest day within a statistic year.
   *
   * @returns {CalendarSO} A calendar statement object
   */
  abstract getBusiestDay(): CalendarSO;

  /**
   * Used to calculate contribution count of the different types in a statistic
   * year.
   *
   * @returns {Object} A object containing contribution type totals
   */
  abstract getContributions(): {
    commit: Share;
    issue: Share;
    pullRequest: Share;
    pullRequestReview: Share;
    total: number;
  };

  //> Methods
  /**
   * Get the database table name of this osm model.
   *
   * @static
   * @returns {string} A table name
   */
  tableName() {
    return "statistic";
  }

  //> Model Implementation Example
  // class StatisticModel extends StreakSO{
  //   /**
  //    * General usage: objects.create({fields}), objects.filter({id=1}),
  //    *                objects.all()
  //    *
  //    * @see {@link https://bit.ly/2Vxq1tu |SNEK Reconstructor}
  //    *      for further information.
  //    */
  //   public static objects = PlatformSO.getObjects(StatisticModel);

  //   /**
  //    * Fields may contain all fields defined by the database table.
  //    * Notice!: The NOT NULL fields are strictly required!
  //    * Also custom fields are possible too.
  //    * Notice!: Custom field cannot be saved in the database without
  //    *          modifying the initialize statement of the statement
  //    *          object!
  //    *
  //    * @see {@link https://bit.ly/3aeo9Lr |Statistic SQL statements}
  //    *      for further information.
  //    */
  //   constructor(fields: StatisticFields){
  //     super();
  //
  //     this.id = fields.id;
  //   }

  //   /**
  //    * Example method:
  //    *
  //    * @description A method to save the object to the database.
  //    * Only fields defined in the constructor will be saved!
  //    * IMPORTANT!: The fields in objects.create() have to match the SQL
  //    *             insert statement! Therefore unused fields have to be set
  //    *             to null!
  //    */
  //   save(){
  //     StatisticModel.objects.create({id: this.id});
  //   }

  //   /**
  //    * Example method:
  //    *
  //    * @description A method to filter the database for id=0.
  //    */
  //   getFirstItem(){
  //     return StatisticModel.objects.filter({id: 0}) as StatisticModel;
  //   }

  //   /**
  //    * Example method:
  //    *
  //    * @description A method to get all entries and parse it to a list of
  //    *              models.
  //    */
  //   getAll(){
  //     return StatisticModel.objects.all() as StatisticModel[];
  //   }
  // }
}

/**
 * @abstract
 * @class A statement object which implements the streak sql statements
 */
abstract class StreakSO extends BaseSO {
  //> Static Fields
  static statements = streak;

  //> Methods
  /**
   * Get the database table name of this osm model.
   *
   * @static
   * @returns {string} A table name
   */
  tableName() {
    return "streak";
  }

  //> Model Implementation Example
  // class StreakModel extends StreakSO{
  //   /**
  //    * General usage: objects.create({fields}), objects.filter({id=1}),
  //    *                objects.all()
  //    *
  //    * @see {@link https://bit.ly/2Vxq1tu |SNEK Reconstructor}
  //    *      for further information.
  //    */
  //   public static objects = PlatformSO.getObjects(StreakModel);

  //   /**
  //    * Fields may contain all fields defined by the database table.
  //    * Notice!: The NOT NULL fields are strictly required!
  //    * Also custom fields are possible too.
  //    * Notice!: Custom field cannot be saved in the database without
  //    *          modifying the initialize statement of the statement
  //    *          object!
  //    *
  //    * @see {@link https://bit.ly/2yhpDY6 |Streak SQL statements}
  //    *      for further information.
  //    */
  //   constructor(fields: StreakFields){
  //     super();
  //
  //     this.id = fields.id;
  //   }

  //   /**
  //    * Example method:
  //    *
  //    * @description A method to save the object to the database.
  //    * Only fields defined in the constructor will be saved!
  //    * IMPORTANT!: The fields in objects.create() have to match the SQL
  //    *             insert statement! Therefore unused fields have to be set
  //    *             to null!
  //    */
  //   save(){
  //     StreakModel.objects.create({id: this.id});
  //   }

  //   /**
  //    * Example method:
  //    *
  //    * @description A method to filter the database for id=0.
  //    */
  //   getFirstItem(){
  //     return StreakModel.objects.filter({id: 0}) as StreakModel;
  //   }

  //   /**
  //    * Example method:
  //    *
  //    * @description A method to get all entries and parse it to a list of
  //    *              models.
  //    */
  //   getAll(){
  //     return StreakModel.objects.all() as StreakModel[];
  //   }
  // }
}

/**
 * @abstract
 * @class A statement object which implements the calendar sql statements
 */
abstract class CalendarSO extends BaseSO {
  //> Static Fields
  static statements = calendar;

  //> Static Methods
  /**
   * Get all days between two dates.
   *
   * @static
   * @param dates From and to date
   * @returns {object[]} A list of objects containing day data
   */
  static getDaysBetweenDate(dates: { from: string; to: string }) {
    let days = SOAssembler.database.exec(CalendarSO.statements.betweenDate, [
      dates.from,
      dates.to,
    ]);

    return days;
  }

  /**
   * Get the busiest day between two dates.
   *
   * @static
   * @param dates From and to date
   * @returns {object} A objects containing day data
   */
  static getBusiestDay(dates: { from: string; to: string }) {
    let response = SOAssembler.database.exec(
      CalendarSO.statements.busiestDayBetweenDate(
        moment(dates.from).format("YYYY-MM-DD"),
        moment(dates.to).format("YYYY-MM-DD")
      )
    )[0];

    return response;
  }

  /**
   *  Get a generated calendar containing days between from and to date.
   *
   * @static
   * @param dates From and to date
   * @returns {object} A object containing a success and calendar data
   */
  static getCalendar(dates: { from: string; to: string }) {
    // generate calendar
    let calendar = helper.calendar.generateCalendarStructure(
      dates.from,
      dates.to
    );

    // fill totals
    calendar.weeks.forEach((week) => {
      week.days.forEach((day) => {
        let entries = SOAssembler.database.exec(
          CalendarSO.statements.dayByDate,
          [day.date]
        );

        let total = 0;

        if (entries.length > 0) {
          let selectedDay = entries[0];

          total = selectedDay.total;
        }

        day.total = total;
      });
    });

    try {
      let busiestDayTotal = 0;
      let busiestDay = CalendarSO.getBusiestDay(dates);

      if (busiestDay) {
        busiestDayTotal = busiestDay.total;
      }

      helper.calendar.fillCalendarWithColors(calendar, busiestDayTotal);

      return {
        success: true,
        data: calendar,
      };
    } catch (err) {
      return {
        success: false,
        data: helper.calendar.generateCalendarStructure(dates.from, dates.to),
        message: "Check for data in the calendar table.",
      };
    }
  }

  //> Abstract Methods
  /**
   * Create a contribution within the calendar day.
   *
   * @param fields Contribution data
   * @returns {MemberSO} A contribution statement object
   */
  abstract createContribution(fields: any): ContributionSO;

  //> Methods
  /**
   * Get the database table name of this osm model.
   *
   * @static
   * @returns {string} A table name
   */
  tableName() {
    return "calendar";
  }

  //> Model Implementation Example
  // class CalendarModel extends CalendarSO{
  //   /**
  //    * General usage: objects.create({fields}), objects.filter({id=1}),
  //    *                objects.all()
  //    *
  //    * @see {@link https://bit.ly/2Vxq1tu |SNEK Reconstructor}
  //    *      for further information.
  //    */
  //   public static objects = PlatformSO.getObjects(CalendarModel);

  //   /**
  //    * Fields may contain all fields defined by the database table.
  //    * Notice!: The NOT NULL fields are strictly required!
  //    * Also custom fields are possible too.
  //    * Notice!: Custom field cannot be saved in the database without
  //    *          modifying the initialize statement of the statement
  //    *          object!
  //    *
  //    * @see {@link https://bit.ly/3clyGpB |Calendar SQL statements}
  //    *      for further information.
  //    */
  //   constructor(fields: CalendarFields){
  //     super();
  //
  //     this.id = fields.id;
  //   }

  //   /**
  //    * Example method:
  //    *
  //    * @description A method to save the object to the database.
  //    * Only fields defined in the constructor will be saved!
  //    * IMPORTANT!: The fields in objects.create() have to match the SQL
  //    *             insert statement! Therefore unused fields have to be set
  //    *             to null!
  //    */
  //   save(){
  //     CalendarModel.objects.create({id: this.id});
  //   }

  //   /**
  //    * Example method:
  //    *
  //    * @description A method to filter the database for id=0.
  //    */
  //   getFirstItem(){
  //     return CalendarModel.objects.filter({id: 0}) as CalendarModel;
  //   }

  //   /**
  //    * Example method:
  //    *
  //    * @description A method to get all entries and parse it to a list of
  //    *              models.
  //    */
  //   getAll(){
  //     return CalendarModel.objects.all() as CalendarModel[];
  //   }
  // }
}

/**
 * @abstract
 * @class A statement object which implements the contribution sql statements
 */
abstract class ContributionSO extends BaseSO {
  //> Static Fields
  static statements = contribution;

  //> Methods
  /**
   * Get the database table name of this osm model.
   *
   * @static
   * @returns {string} A table name
   */
  tableName() {
    return "contribution";
  }

  //> Model Implementation Example
  // class ContributionModel extends ContributionSO{
  //   /**
  //    * General usage: objects.create({fields}), objects.filter({id=1}),
  //    *                objects.all()
  //    *
  //    * @see {@link https://bit.ly/2Vxq1tu |SNEK Reconstructor}
  //    *      for further information.
  //    */
  //   public static objects = PlatformSO.getObjects(ContributionModel);

  //   /**
  //    * Fields may contain all fields defined by the database table.
  //    * Notice!: The NOT NULL fields are strictly required!
  //    * Also custom fields are possible too.
  //    * Notice!: Custom field cannot be saved in the database without
  //    *          modifying the initialize statement of the statement
  //    *          object!
  //    *
  //    * @see {@link https://bit.ly/2XGCIVu |Contribution SQL statements}
  //    *      for further information.
  //    */
  //   constructor(fields: ContributionFields){
  //     super();
  //
  //     this.id = fields.id;
  //   }

  //   /**
  //    * Example method:
  //    *
  //    * @description A method to save the object to the database.
  //    * Only fields defined in the constructor will be saved!
  //    * IMPORTANT!: The fields in objects.create() have to match the SQL
  //    *             insert statement! Therefore unused fields have to be set
  //    *             to null!
  //    */
  //   save(){
  //     ContributionModel.objects.create({id: this.id});
  //   }

  //   /**
  //    * Example method:
  //    *
  //    * @description A method to filter the database for id=0.
  //    */
  //   getFirstItem(){
  //     return ContributionModel.objects.filter({id: 0}) as ContributionModel;
  //   }

  //   /**
  //    * Example method:
  //    *
  //    * @description A method to get all entries and parse it to a list of
  //    *              models.
  //    */
  //   getAll(){
  //     return ContributionModel.objects.all() as ContributionModel[];
  //   }
  // }
}

/**
 * @abstract
 * @class A statement object which implements the talk sql statements
 */
abstract class TalkSO extends BaseSO {
  //> Static Fields
  static statements = talk;

  //> Methods
  /**
   * Get the database table name of this osm model.
   *
   * @static
   * @returns {string} A table name
   */
  tableName() {
    return "talk";
  }

  //> Model Implementation Example
  // class TalkModel extends TalkSO{
  //   /**
  //    * General usage: objects.create({fields}), objects.filter({id=1}),
  //    *                objects.all()
  //    *
  //    * @see {@link https://bit.ly/2Vxq1tu |SNEK Reconstructor}
  //    *      for further information.
  //    */
  //   public static objects = TalkSO.getObjects(TalkModel);

  //   /**
  //    * Fields may contain all fields defined by the database table.
  //    * Notice!: The NOT NULL fields are strictly required!
  //    * Also custom fields are possible too.
  //    * Notice!: Custom field cannot be saved in the database without
  //    *          modifying the initialize statement of the statement
  //    *          object!
  //    *
  //    * @see {@link https://bit.ly/2XGCIVu |Talk SQL statements}
  //    *      for further information.
  //    */
  //   constructor(fields: TalkFields){
  //     super();
  //
  //     this.id = fields.id;
  //   }

  //   /**
  //    * Example method:
  //    *
  //    * @description A method to save the object to the database
  //    * Only fields defined in the constructor will be saved!
  //    * IMPORTANT!: The fields in objects.create() have to match the SQL
  //    *             insert statement! Therefore unused fields have to be set
  //    *             to null!
  //    */
  //   save(){
  //     TalkModel.objects.create({id: this.id});
  //   }

  //   /**
  //    * Example method:
  //    *
  //    * @description A method to filter the database for id=0
  //    */
  //   getFirstItem(){
  //     return TalkModel.objects.filter({id: 0}) as TalkModel;
  //   }

  //   /**
  //    * Example method:
  //    *
  //    * @description A method to get all entries and parse it to a list of
  //    *              models.
  //    */
  //   getAll(){
  //     return TalkModel.objects.all() as TalkModel[];
  //   }
  // }
}
//#endregion

//#region > Exports
//> Interfaces
export type { Share };
//> Statement Objects
export {
  BaseSO,
  PlatformSO,
  MemberSO,
  RepositorySO,
  RepositoryHasMemberSO,
  LanguageSO,
  PlatformHasRepositorySO,
  OrganizationSO,
  OrganizationHasMemberSO,
  PlatformHasOrganizationSO,
  StatisticSO,
  StreakSO,
  CalendarSO,
  ContributionSO,
  TalkSO,
};
//#endregion

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019-2020 Simon Prast
 */
