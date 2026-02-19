import * as bcrypt from 'bcrypt';
import { v4 as uuid4 } from 'uuid';
import { UserPayload } from '../service/user.service.interface';

export class User {
  private id: string;
  private login: string;
  private password: string;

  constructor(id: string, login: string, password: string) {
    this.id = id;
    this.login = login;
    this.password = password;
  }
  getId(): string {
    return this.id;
  }

  getLogin(): string {
    return this.login;
  }

  async verifyPassword(password: string) {
    return await bcrypt.compare(password, this.password);
  }

  static async create(data: UserPayload): Promise<User> {
    const hashPassword = await bcrypt.hash(data.password, 12);
    const id = uuid4();

    return new User(id, data.login, hashPassword);
  }

  static restore(id: string, login: string, password: string) {
    return new User(id, login, password);
  }
}

// import * as bcrypt from 'bcrypt';
//
// // ─── Yordamchi tiplar ────────────────────────────────────────────────────────
//
// /** Muvaffaqiyatli yoki xatoli natijani ifodalaydi (exception o'rniga) */
// export type Result<T, E = string> =
//   | { success: true; value: T }
//   | { success: false; error: E };
//
// const ok = <T>(value: T): Result<T> => ({ success: true, value });
// const fail = <T>(error: string): Result<T> => ({ success: false, error });
//
// // ─── Konstantalar ────────────────────────────────────────────────────────────
//
// const BCRYPT_ROUNDS = 12; // 10 emas, 12 — zamonaviy standart
//
// const PASSWORD_RULES = {
//   minLength: 8,
//   maxLength: 72, // bcrypt 72 baytdan ko'pini e'tiborsiz qoldiradi
//   pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/,
// } as const;
//
// const LOGIN_RULES = {
//   minLength: 3,
//   maxLength: 32,
//   pattern: /^[a-zA-Z0-9_.-]+$/,
// } as const;
//
// // ─── Value Object: HashedPassword ────────────────────────────────────────────
//
// /**
//  * Parol logikasini alohida Value Object sifatida ajratish:
//  * - Hashing va tekshirish faqat shu sinfning mas'uliyati
//  * - User sinfi parol tafsilotlari bilan shug'ullanmaydi
//  */
// export class HashedPassword {
//   private constructor(private readonly hash: string) {}
//
//   /** Yangi ochiq paroldan xeshlanган nusxa yaratadi */
//   static async fromPlain(plain: string): Promise<Result<HashedPassword>> {
//     const validation = HashedPassword.validatePlain(plain);
//     if (!validation.success) return fail(validation.error);
//
//     const salt = await bcrypt.genSalt(BCRYPT_ROUNDS);
//     const hash = await bcrypt.hash(plain, salt);
//     return ok(new HashedPassword(hash));
//   }
//
//   /** Mavjud xeshdan tiklash (masalan, DB dan o'qiganda) */
//   static fromHash(existingHash: string): HashedPassword {
//     if (!existingHash?.startsWith('$2')) {
//       throw new Error('Yaroqsiz bcrypt xeshi formati');
//     }
//     return new HashedPassword(existingHash);
//   }
//
//   /** Ochiq parolni xesh bilan solishtiradi */
//   async verify(plain: string): Promise<boolean> {
//     return bcrypt.compare(plain, this.hash);
//   }
//
//   /** Xeshni saqlash/serializatsiya uchun qaytaradi */
//   getValue(): string {
//     return this.hash;
//   }
//
//   /** Parol qoidalarini tekshiradi */
//   private static validatePlain(plain: string): Result<void> {
//     if (!plain || plain.length < PASSWORD_RULES.minLength) {
//       return fail(
//         `Parol kamida ${PASSWORD_RULES.minLength} ta belgidan iborat bo'lishi kerak`,
//       );
//     }
//     if (plain.length > PASSWORD_RULES.maxLength) {
//       return fail(
//         `Parol ${PASSWORD_RULES.maxLength} ta belgidan oshmasligi kerak`,
//       );
//     }
//     if (!PASSWORD_RULES.pattern.test(plain)) {
//       return fail(
//         'Parol katta/kichik harf, raqam va maxsus belgi talab qiladi',
//       );
//     }
//     return ok(undefined);
//   }
// }
//
// // ─── Domain Entity: User ─────────────────────────────────────────────────────
//
// export interface UserSnapshot {
//   id: string;
//   login: string;
//   passwordHash: string;
//   createdAt: Date;
//   updatedAt: Date;
// }
//
// export class User {
//   private password: HashedPassword;
//   private readonly _createdAt: Date;
//   private _updatedAt: Date;
//
//   /** Tashqaridan to'g'ridan-to'g'ri `new User()` ishlatib bo'lmaydi */
//   private constructor(
//     private readonly _id: string,
//     private _login: string,
//     passwordHash: string,
//     createdAt: Date,
//     updatedAt: Date,
//   ) {
//     this.password = HashedPassword.fromHash(passwordHash);
//     this._createdAt = createdAt;
//     this._updatedAt = updatedAt;
//   }
//
//   // ── Getterlar (faqat o'qish) ────────────────────────────────────────────
//
//   get id(): string {
//     return this._id;
//   }
//   get login(): string {
//     return this._login;
//   }
//   get createdAt(): Date {
//     return this._createdAt;
//   }
//   get updatedAt(): Date {
//     return this._updatedAt;
//   }
//
//   // ── Factory metodlar ────────────────────────────────────────────────────
//
//   /**
//    * YANGI foydalanuvchi yaratish.
//    * Barcha validatsiyalar shu yerda bajariladi.
//    */
//   static async create(
//     id: string,
//     login: string,
//     plainPassword: string,
//   ): Promise<Result<User>> {
//     const loginValidation = User.validateLogin(login);
//     if (!loginValidation.success) return fail(loginValidation.error);
//
//     const passwordResult = await HashedPassword.fromPlain(plainPassword);
//     if (!passwordResult.success) return fail(passwordResult.error);
//
//     const now = new Date();
//     return ok(new User(id, login, passwordResult.value.getValue(), now, now));
//   }
//
//   /**
//    * Bazadan o'qilgan ma'lumotdan tiklash.
//    * Parol validatsiyasi o'tkazilmaydi (allaqachon xeshlangan).
//    */
//   static restore(snapshot: UserSnapshot): User {
//     return new User(
//       snapshot.id,
//       snapshot.login,
//       snapshot.passwordHash,
//       snapshot.createdAt,
//       snapshot.updatedAt,
//     );
//   }
//
//   // ── Domain metodlar ─────────────────────────────────────────────────────
//
//   /** Parolni tekshiradi */
//   async verifyPassword(plain: string): Promise<boolean> {
//     return this.password.verify(plain);
//   }
//
//   /** Parolni yangilaydi */
//   async changePassword(
//     currentPlain: string,
//     newPlain: string,
//   ): Promise<Result<void>> {
//     const isValid = await this.verifyPassword(currentPlain);
//     if (!isValid) return fail("Joriy parol noto'g'ri");
//
//     const newPasswordResult = await HashedPassword.fromPlain(newPlain);
//     if (!newPasswordResult.success) return fail(newPasswordResult.error);
//
//     this.password = newPasswordResult.value;
//     this._updatedAt = new Date();
//     return ok(undefined);
//   }
//
//   /** Loginni yangilaydi */
//   updateLogin(newLogin: string): Result<void> {
//     const validation = User.validateLogin(newLogin);
//     if (!validation.success) return fail(validation.error);
//
//     this._login = newLogin;
//     this._updatedAt = new Date();
//     return ok(undefined);
//   }
//
//   // ── Serializatsiya ──────────────────────────────────────────────────────
//
//   /** Bazaga saqlash uchun "snapshot" qaytaradi */
//   toSnapshot(): UserSnapshot {
//     return {
//       id: this._id,
//       login: this._login,
//       passwordHash: this.password.getValue(),
//       createdAt: this._createdAt,
//       updatedAt: this._updatedAt,
//     };
//   }
//
//   /** JSON da faqat xavfsiz maydonlar chiqadi (parol hech qachon yo'q!) */
//   toJSON(): Omit<UserSnapshot, 'passwordHash'> {
//     const { passwordHash: _, ...safe } = this.toSnapshot();
//     return safe;
//   }
//
//   // ── Yordamchi validatsiya ───────────────────────────────────────────────
//
//   private static validateLogin(login: string): Result<void> {
//     if (!login || login.length < LOGIN_RULES.minLength) {
//       return fail(
//         `Login kamida ${LOGIN_RULES.minLength} ta belgidan iborat bo'lishi kerak`,
//       );
//     }
//     if (login.length > LOGIN_RULES.maxLength) {
//       return fail(
//         `Login ${LOGIN_RULES.maxLength} ta belgidan oshmasligi kerak`,
//       );
//     }
//     if (!LOGIN_RULES.pattern.test(login)) {
//       return fail(
//         "Login faqat harf, raqam, _ . - belgilaridan iborat bo'lishi kerak",
//       );
//     }
//     return ok(undefined);
//   }
// }
