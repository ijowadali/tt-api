import { DateTime } from "luxon";
import Hash from "@ioc:Adonis/Core/Hash";
import {
  column,
  beforeSave,
  BaseModel,
  ManyToMany,
  manyToMany,
  hasOne,
  HasOne,
  beforeFind,
  // beforeFetch,
  afterFetch,
  ModelQueryBuilderContract,
  belongsTo,
  BelongsTo,
} from "@ioc:Adonis/Lucid/Orm";
import Permission from "App/Models/Acl/Permission";
import Role from "App/Models/Acl/Role";
import UserProfile from "App/Models/UserProfile";
import Shop from "App/Models/Shop";
import { STANDARD_DATE_TIME_FORMAT } from "App/Helpers/utils";

type UserQuery = ModelQueryBuilderContract<typeof User>;
type RoleQuery = ModelQueryBuilderContract<typeof Role>;

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public ShopId: number;

  @column()
  public email: string;

  @column()
  public phone_number: string;

  @column()
  public userType: string;

  @column({ serializeAs: null })
  public password: string;

  @column()
  public isPhoneVerified: boolean;

  @column()
  public isEmailVerified: boolean;

  @column()
  public rememberMeToken: string | null;

  @column.dateTime({
    autoCreate: true,
    serialize(value: DateTime) {
      return value ? value.toFormat(STANDARD_DATE_TIME_FORMAT) : "";
    },
  })
  public createdAt: DateTime;

  @column.dateTime({
    autoCreate: true,
    autoUpdate: true,
    serialize(value: DateTime) {
      return value ? value.toFormat(STANDARD_DATE_TIME_FORMAT) : "";
    },
  })
  public updatedAt: DateTime;

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password);
    }
  }

  // Relations
  @manyToMany(() => Role, {
    pivotTable: "user_has_roles",
    localKey: "id",
    pivotForeignKey: "user_id",
    relatedKey: "id",
    pivotRelatedForeignKey: "role_id",
  })
  public roles: ManyToMany<typeof Role>;

  @manyToMany(() => Permission, {
    pivotTable: "user_has_permissions",
    localKey: "id",
    pivotForeignKey: "user_id",
    relatedKey: "id",
    pivotRelatedForeignKey: "permission_id",
  })
  public permissions: ManyToMany<typeof Permission>;

  @hasOne(() => UserProfile, {
    localKey: "id",
    foreignKey: "user_id",
  })
  public userProfile: HasOne<typeof UserProfile>;

  @belongsTo(() => Shop)
  public shop: BelongsTo<typeof Shop>;

  //Hooks
  @beforeFind()
  public static preloadListUserRoles(query: UserQuery) {
    query
      .preload("roles", (rolesQuery: RoleQuery) => {
        rolesQuery.preload("permissions");
      })
      .preload("permissions");
  }

  // @beforeFetch()
  // public static preloadUserRoles(query: UserQuery) {
  //   query.preload("roles").preload("permissions");
  // }

  @afterFetch()
  public static deletePasswordList(users: User[]) {
    users.forEach((user) => {
      delete user.$attributes.password;
    });
  }
}
