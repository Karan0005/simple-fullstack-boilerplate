/**
 * @fileoverview This file defines the UserEntity schema for the Mongoose ODM,
 * using the NestJS Mongoose module. The schema represents a "User" collection
 * in the database and includes fields like first name, last name, email,
 * hashed password, and isActive status. It also creates an index on the `email`
 * field to ensure uniqueness and optimize queries.
 *
 * @module UserEntity
 */

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

/**
 * Represents the Mongoose document type for a UserEntity.
 * This combines the schema properties with the Mongoose Document functionality.
 */
export type UserDocument = UserEntity & Document;

/**
 * UserEntity schema definition for the "User" collection.
 *
 * @schema UserEntity
 * @property {string} firstName - The user's first name. Required and trimmed with a maximum length of 100 characters.
 * @property {string} lastName - The user's last name. Required and trimmed with a maximum length of 100 characters.
 * @property {string} email - The user's email address. Required, trimmed, and unique with a maximum length of 200 characters.
 * @property {string} hashedPassword - The user's hashed password. Required with a minimum length of 60 and a maximum of 500 characters.
 * @property {boolean} isActive - Indicates whether the user is active. Defaults to `true`.
 * @index email - A unique index is applied to the `email` field to ensure uniqueness and improve query performance.
 * @option {boolean} versionKey - Disabled to remove the `__v` field from documents.
 * @option {boolean} timestamps - Enabled to automatically add `createdAt` and `updatedAt` fields to documents.
 */
@Schema({ collection: 'User', versionKey: false, timestamps: true })
export class UserEntity {
    /**
     * The user's first name.
     */
    @Prop({ type: String, required: true, trim: true, maxlength: 100 })
    firstName!: string;

    /**
     * The user's last name.
     */
    @Prop({ type: String, required: true, trim: true, maxlength: 100 })
    lastName!: string;

    /**
     * The user's email address.
     */
    @Prop({ type: String, required: true, trim: true, maxlength: 200 })
    email!: string;

    /**
     * The hashed version of the user's password.
     */
    @Prop({ type: String, required: true, minlength: 60, maxlength: 500 })
    hashedPassword!: string;

    /**
     * Indicates if the user is active.
     */
    @Prop({ type: Boolean, default: true })
    isActive!: boolean;
}

/**
 * The Mongoose schema generated for the UserEntity class.
 */
export const UserSchema = SchemaFactory.createForClass(UserEntity);

/**
 * Indexes:
 * Adds a unique index on the `email` field to ensure email uniqueness
 * and to optimize queries involving email.
 */
UserSchema.index({ email: 1 }, { unique: true, background: true });
