import { randomBytes, createHmac } from "node:crypto";
import * as JWT from "jsonwebtoken";
import { db, eq } from "@repo/database";
import { passwordResetTokensTable, usersTable } from "@repo/database/models/user";
import {
  type createUserWithEmailAndPasswordInputType,
  createUserWithEmailAndPasswordInput,
  forgetPasswordInput,
  forgetPasswordInputType,
  resetPasswordInput,
  resetPasswordInputType,
  generateUserTokenPayloadInput,
  generateUserTokenPayloadInputType,
  signInUserWithEmailAndPasswordInput,
  signInUserWithEmailAndPasswordInputType,
  verifyUserEmailWithTokenInput,
  verifyUserEmailWithTokenInputType
} from "./model";

import EmailService from "../email";
import { env } from "../env";

class UserService {

  private async getUserInfoById(id: string) {
    const user = await db.select({
      id: usersTable.id,
      email: usersTable.email,
      fullName: usersTable.fullName,
      profileImageUrl: usersTable.profileImageUrl
    }).from(usersTable).where(eq(usersTable.id, id))

    if (!user || user.length === 0) throw new Error(`user with id does not exist`);

    return user[0];
  }


  private async getUserByEmail(email: string) {
    const result = await db.select().from(usersTable).where(eq(usersTable.email, email));
    if (!result || result.length === 0) return null;
    return result[0];
  }


  private async getUserById(id: string) {
    const result = await db.select().from(usersTable).where(eq(usersTable.id, id));
    if (!result || result.length === 0) return null;
    return result[0];
  }


  private async getPasswordResetTokenUserId(id: string) {
    const result = await db.select()
      .from(passwordResetTokensTable)
      .where(eq(passwordResetTokensTable.userId, id));
    if (!result || result.length === 0) return null;
    return result[0];
  }


  private async generateUserToken(payload: generateUserTokenPayloadInputType) {
    const { id } = await generateUserTokenPayloadInput.parseAsync(payload);

    const token = JWT.sign({ id }, env.JWT_SECRET);
    return { token }
  }


  private async verifyUserToken(token: string): Promise<generateUserTokenPayloadInputType> {
    try {
      const verificationResult = JWT.verify(token, env.JWT_SECRET) as generateUserTokenPayloadInputType;
      return verificationResult;
    } catch (error) {
      throw new Error(`Invalid token`)
    }

  }


  private async generateHash(salt: string, password: string) {
    return createHmac("sha256", salt).update(password).digest("hex");
  }


  public async createUserWithEmailAndPassword(payload: createUserWithEmailAndPasswordInputType) {
    // TODO: implement user creation logic

    const { fullName, email, password } = await createUserWithEmailAndPasswordInput.parseAsync(payload);

    //check if user is already exist or not 
    const existingUserWithEmail = await this.getUserByEmail(email);
    if (existingUserWithEmail) throw new Error(`Unable to create account with the provided details.`);


    // calculate salt and hash the password
    const salt = randomBytes(16).toString("hex");
    const hash = await this.generateHash(salt, password)

    // insert user to database
    const userInsertResult = await db.insert(usersTable).values({
      fullName,
      email,
      password: hash,
      salt,
    }).returning({ id: usersTable.id })

    if (!userInsertResult || userInsertResult.length === 0 || !userInsertResult[0]?.id) throw new Error("Failed to create user");

    const userId = userInsertResult[0].id;

    // send email for verification
    const { token: verificationToken } = await this.generateUserToken({ id: userId });

    // send email for verification
    await EmailService.sendEmailVerificationEmail(email, verificationToken);


    const { token } = await this.generateUserToken({ id: userId });

    return {
      id: userId,
      token,
    }

  }


  public async signInUserWithEmailAndPassword(payload: signInUserWithEmailAndPasswordInputType) {

    const { email, password } = await signInUserWithEmailAndPasswordInput.parseAsync(payload);

    const existingUser = await this.getUserByEmail(email);

    if (!existingUser) throw new Error(`User with email ${email} does not exist`);
    if (!existingUser.password || !existingUser.salt) throw new Error(`Invalid authentication method`)


    const hash = await this.generateHash(existingUser.salt, password);
    if (hash !== existingUser.password) throw new Error(`Invalid email address & password`)


    if (!existingUser.emailVerified) throw new Error(`Email much be verified`)

    const { token } = await this.generateUserToken({ id: existingUser.id });

    return {
      id: existingUser.id,
      token
    }
  }


  public async verifyUserEmailWithToken(payload: verifyUserEmailWithTokenInputType) {

    // parse input 
    const { token } = await verifyUserEmailWithTokenInput.parseAsync(payload);

    // verify token
    const { id } = await this.verifyUserToken(token)

    // check if user is exist or not
    const user = await this.getUserById(id)

    if (!user) throw new Error(`User with id does not exist`);
    if (user.emailVerified) throw new Error(`Email already verified`);

    // update true to emailVerified
    await db.update(usersTable).set({ emailVerified: true }).where(eq(usersTable.id, id));

    return { id };
  }


  public async verifyAndDecoderUserToken(token: string) {
    const { id } = await this.verifyUserToken(token)
    const userInfo = await this.getUserInfoById(id)
    return { ...userInfo };
  }


  public async forgetPassword(payload: forgetPasswordInputType) {
    const { email } = await forgetPasswordInput.parseAsync(payload);

    const userInfo = await this.getUserByEmail(email);
    if (!userInfo) throw new Error(`User does not exist`);

    const { token: resetPasswordToken } = await this.generateUserToken({ id: userInfo.id });

    // insert password reset token to database
    await db.insert(passwordResetTokensTable).values({
      userId: userInfo.id,
      passwordResetToken: resetPasswordToken,
      passwordResetExpiresAt: new Date(Date.now() + 60 * 10 * 1000), // 10 minutes
    }).returning({ id: passwordResetTokensTable.id })

    // send email for reset password
    await EmailService.sendResetPasswordEmail(email, resetPasswordToken);

    const message = "Reset password token sent to your email address."
    return { message };

  }


  public async setNewPasswordForEmailUser(payload: resetPasswordInputType) {
    const { token, password } = await resetPasswordInput.parseAsync(payload);

    const { id } = await this.verifyUserToken(token);


    const tokenInfo = await this.getPasswordResetTokenUserId(id);
    if (!tokenInfo) throw new Error("Reset token not found");


    if (tokenInfo.passwordResetToken !== token) throw new Error("Reset token is invalid");
    if (tokenInfo.passwordResetExpiresAt && new Date() > tokenInfo.passwordResetExpiresAt) throw new Error("Reset token has expired");


    const userInfo = await this.getUserById(tokenInfo.userId);
    if (!userInfo) throw new Error(`User does not exist`);

    // update password
    const hash = await this.generateHash(userInfo.salt, password);

    await db.update(usersTable).set({ password: hash }).where(eq(usersTable.id, userInfo.id));

    // Delete token from database after successful reset
    await db.delete(passwordResetTokensTable).where(eq(passwordResetTokensTable.userId, tokenInfo.userId));

    return { id: userInfo.id };
  }

}


export default UserService;
